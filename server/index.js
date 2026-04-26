import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDb, db, runTransaction } from './storage.js';
import { authenticate, requireAdmin, createToken, hashPassword, verifyPassword } from './security.js';
import { buildOrderEmail, buildBookingEmail, queueEmail } from './services/email.js';

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
const isAllowedLocalOrigin = (origin = '') => /^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

initDb();

app.use(cors({
  origin(origin, callback) {
    if (!origin || origin === CLIENT_URL || isAllowedLocalOrigin(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

const asMenu = (row) => ({
  ...row,
  price: Number(row.price),
  is_available: Boolean(row.is_available)
});

const asReview = (row) => ({
  ...row,
  rating: Number(row.rating)
});

const orderWithItems = (order) => {
  const items = db.prepare(`
    SELECT oi.*, m.name, m.image_url
    FROM order_items oi
    JOIN menu_items m ON m.id = oi.menu_item_id
    WHERE oi.order_id = ?
  `).all(order.id);
  const payment = db.prepare(`
    SELECT method, provider, status, reference
    FROM payments
    WHERE order_id = ?
    ORDER BY created_at DESC
    LIMIT 1
  `).get(order.id);
  return {
    ...order,
    subtotal: Number(order.subtotal),
    delivery_charge: Number(order.delivery_charge),
    total: Number(order.total),
    payment_method: payment?.method || null,
    payment_provider: payment?.provider || null,
    payment_status: payment?.status || null,
    payment_reference: payment?.reference || null,
    items: items.map((item) => ({
      ...item,
      unit_price: Number(item.unit_price),
      line_total: Number(item.line_total)
    }))
  };
};

const validateRequired = (body, fields) => {
  const missing = fields.filter((field) => !String(body[field] ?? '').trim());
  if (missing.length) {
    return `Missing required field${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`;
  }
  return null;
};

const getAuthUser = (req) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  try {
    return authenticate.decode(header.slice(7));
  } catch {
    return null;
  }
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'Aurora Table API' });
});

app.post('/api/auth/register', async (req, res) => {
  const error = validateRequired(req.body, ['name', 'email', 'phone', 'password']);
  if (error) return res.status(400).json({ error });
  const { name, email, phone, password } = req.body;
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  try {
    const result = db.prepare(`
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES (?, ?, ?, ?, 'customer')
    `).run(name.trim(), email.trim().toLowerCase(), phone.trim(), await hashPassword(password));
    const user = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ user, token: createToken(user) });
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) return res.status(409).json({ error: 'An account already exists for this email.' });
    res.status(500).json({ error: 'Could not create account.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const error = validateRequired(req.body, ['email', 'password']);
  if (error) return res.status(400).json({ error });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(String(req.body.email).trim().toLowerCase());
  if (!user || !(await verifyPassword(req.body.password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  const safeUser = { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, created_at: user.created_at };
  res.json({ user: safeUser, token: createToken(safeUser) });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const user = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(req.user.id);
  res.json({ user });
});

app.get('/api/menu', (_req, res) => {
  const items = db.prepare('SELECT * FROM menu_items WHERE is_deleted = 0 ORDER BY category, name').all().map(asMenu);
  res.json({ items });
});

app.post('/api/menu', authenticate, requireAdmin, (req, res) => {
  const error = validateRequired(req.body, ['name', 'category', 'price', 'description', 'image_url']);
  if (error) return res.status(400).json({ error });
  const { name, category, price, description, image_url, is_available = true } = req.body;
  if (Number(price) <= 0) return res.status(400).json({ error: 'Price must be greater than zero.' });
  const result = db.prepare(`
    INSERT INTO menu_items (name, category, price, description, image_url, is_available)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, category, Number(price), description, image_url, is_available ? 1 : 0);
  res.status(201).json({ item: asMenu(db.prepare('SELECT * FROM menu_items WHERE id = ?').get(result.lastInsertRowid)) });
});

app.put('/api/menu/:id', authenticate, requireAdmin, (req, res) => {
  const error = validateRequired(req.body, ['name', 'category', 'price', 'description', 'image_url']);
  if (error) return res.status(400).json({ error });
  const result = db.prepare(`
    UPDATE menu_items
    SET name = ?, category = ?, price = ?, description = ?, image_url = ?, is_available = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(req.body.name, req.body.category, Number(req.body.price), req.body.description, req.body.image_url, req.body.is_available ? 1 : 0, req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Menu item not found.' });
  res.json({ item: asMenu(db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id)) });
});

app.delete('/api/menu/:id', authenticate, requireAdmin, (req, res) => {
  const result = db.prepare('UPDATE menu_items SET is_deleted = 1, is_available = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Menu item not found.' });
  res.json({ ok: true });
});

app.post('/api/orders', async (req, res) => {
  const error = validateRequired(req.body, ['customer_name', 'phone', 'payment_method']);
  if (error) return res.status(400).json({ error });
  const fulfillmentMethod = req.body.fulfillment_method === 'pickup' ? 'pickup' : 'delivery';
  if (fulfillmentMethod === 'delivery' && !String(req.body.address || '').trim()) {
    return res.status(400).json({ error: 'Delivery address is required for delivery orders.' });
  }
  if (!['card', 'cash'].includes(req.body.payment_method)) {
    return res.status(400).json({ error: 'Payment method must be card or cash.' });
  }
  if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
    return res.status(400).json({ error: 'Add at least one menu item before ordering.' });
  }

  const authUser = getAuthUser(req);
  const items = req.body.items.map((item) => ({
    menu_item_id: Number(item.menu_item_id),
    quantity: Math.max(1, Number(item.quantity || 1))
  }));
  const menuRows = db.prepare(`SELECT id, name, price FROM menu_items WHERE is_deleted = 0 AND is_available = 1 AND id IN (${items.map(() => '?').join(',')})`).all(...items.map((item) => item.menu_item_id));
  if (menuRows.length !== new Set(items.map((item) => item.menu_item_id)).size) {
    return res.status(400).json({ error: 'One or more menu items are unavailable.' });
  }

  const priceById = new Map(menuRows.map((item) => [item.id, Number(item.price)]));
  const subtotal = items.reduce((sum, item) => sum + priceById.get(item.menu_item_id) * item.quantity, 0);
  const delivery = fulfillmentMethod === 'pickup' || subtotal >= 60 ? 0 : 4.5;
  const total = Number((subtotal + delivery).toFixed(2));
  const paymentStatus = req.body.payment_method === 'card' ? 'paid' : 'pending';
  const address = fulfillmentMethod === 'pickup' ? 'Pickup at Aurora Table' : req.body.address.trim();
  const locationLink = String(req.body.location_link || '').trim();

  const order = runTransaction(() => {
    const orderResult = db.prepare(`
      INSERT INTO orders (
        user_id, customer_name, email, phone, fulfillment_method, address,
        location_link, notes, status, subtotal, delivery_charge, total
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
    `).run(
      authUser?.id || null,
      req.body.customer_name,
      req.body.email || '',
      req.body.phone,
      fulfillmentMethod,
      address,
      locationLink,
      req.body.notes || '',
      subtotal,
      delivery,
      total
    );
    const orderId = Number(orderResult.lastInsertRowid);
    const itemInsert = db.prepare(`
      INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, line_total)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const item of items) {
      const unitPrice = priceById.get(item.menu_item_id);
      itemInsert.run(orderId, item.menu_item_id, item.quantity, unitPrice, unitPrice * item.quantity);
    }
    db.prepare(`
      INSERT INTO payments (order_id, method, provider, status, amount, reference)
      VALUES (?, ?, 'manual-ready', ?, ?, ?)
    `).run(orderId, req.body.payment_method, paymentStatus, total, `AT-${Date.now()}-${orderId}`);
    return orderWithItems(db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId));
  });

  await queueEmail(buildOrderEmail(order));
  res.status(201).json({ order });
});

app.get('/api/orders', authenticate, requireAdmin, (_req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all().map(orderWithItems);
  res.json({ orders });
});

app.get('/api/my/orders', authenticate, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id).map(orderWithItems);
  res.json({ orders });
});

app.patch('/api/orders/:id/status', authenticate, requireAdmin, (req, res) => {
  const allowed = ['pending', 'preparing', 'completed', 'cancelled'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: 'Invalid order status.' });
  const result = db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(req.body.status, req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Order not found.' });
  res.json({ order: orderWithItems(db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id)) });
});

app.post('/api/bookings', async (req, res) => {
  const error = validateRequired(req.body, ['name', 'phone', 'booking_date', 'booking_time', 'guests']);
  if (error) return res.status(400).json({ error });
  if (Number(req.body.guests) < 1 || Number(req.body.guests) > 20) {
    return res.status(400).json({ error: 'Guests must be between 1 and 20.' });
  }
  const authUser = getAuthUser(req);
  const result = db.prepare(`
    INSERT INTO bookings (
      user_id, name, email, phone, booking_date, booking_time, guests,
      table_type, service_style, seating_area, occasion, table_fee,
      special_request, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).run(
    authUser?.id || null,
    req.body.name,
    req.body.email || '',
    req.body.phone,
    req.body.booking_date,
    req.body.booking_time,
    Number(req.body.guests),
    req.body.table_type || 'Chef Table',
    req.body.service_style || 'A la carte',
    req.body.seating_area || 'Main dining room',
    req.body.occasion || 'Casual dinner',
    Number(req.body.table_fee || 0),
    req.body.special_request || ''
  );
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);
  await queueEmail(buildBookingEmail(booking));
  res.status(201).json({ booking });
});

app.get('/api/bookings', authenticate, requireAdmin, (_req, res) => {
  const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
  res.json({ bookings });
});

app.get('/api/my/bookings', authenticate, (req, res) => {
  const bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json({ bookings });
});

app.patch('/api/bookings/:id/status', authenticate, requireAdmin, (req, res) => {
  const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: 'Invalid booking status.' });
  const result = db.prepare('UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(req.body.status, req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Booking not found.' });
  res.json({ booking: db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id) });
});

app.post('/api/contact', (req, res) => {
  const error = validateRequired(req.body, ['name', 'email', 'phone', 'subject', 'message']);
  if (error) return res.status(400).json({ error });
  const result = db.prepare(`
    INSERT INTO contact_messages (name, email, phone, subject, message)
    VALUES (?, ?, ?, ?, ?)
  `).run(req.body.name, req.body.email, req.body.phone, req.body.subject, req.body.message);
  res.status(201).json({ message: db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(result.lastInsertRowid) });
});

app.get('/api/contact-messages', authenticate, requireAdmin, (_req, res) => {
  const messages = db.prepare('SELECT * FROM contact_messages ORDER BY status ASC, created_at DESC, id DESC').all();
  res.json({ messages });
});

app.patch('/api/contact-messages/:id/status', authenticate, requireAdmin, (req, res) => {
  const allowed = ['open', 'completed'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: 'Invalid request status.' });
  const resolvedAt = req.body.status === 'completed' ? new Date().toISOString() : null;
  const result = db.prepare(`
    UPDATE contact_messages
    SET status = ?, resolved_at = ?
    WHERE id = ?
  `).run(req.body.status, resolvedAt, req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Contact request not found.' });
  res.json({ message: db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(req.params.id) });
});

app.get('/api/reviews', (_req, res) => {
  const reviews = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC, id DESC LIMIT 50').all().map(asReview);
  const summary = db.prepare('SELECT COUNT(*) AS count, COALESCE(AVG(rating), 0) AS average FROM reviews').get();
  res.json({
    reviews,
    summary: {
      count: Number(summary.count),
      average: Number(Number(summary.average).toFixed(1))
    }
  });
});

app.post('/api/reviews', (req, res) => {
  const error = validateRequired(req.body, ['name', 'rating', 'title', 'message']);
  if (error) return res.status(400).json({ error });
  const rating = Number(req.body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5 stars.' });
  }
  const result = db.prepare(`
    INSERT INTO reviews (name, email, rating, title, message)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    String(req.body.name).trim(),
    String(req.body.email || '').trim(),
    rating,
    String(req.body.title).trim(),
    String(req.body.message).trim()
  );
  res.status(201).json({ review: asReview(db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid)) });
});

app.get('/api/admin/dashboard', authenticate, requireAdmin, (_req, res) => {
  const totals = {
    total_orders: db.prepare('SELECT COUNT(*) AS count FROM orders').get().count,
    total_bookings: db.prepare('SELECT COUNT(*) AS count FROM bookings').get().count,
    total_users: db.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'customer'").get().count,
    total_revenue: Number(db.prepare("SELECT COALESCE(SUM(total), 0) AS total FROM orders WHERE status != 'cancelled'").get().total)
  };
  const latest_orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5').all().map(orderWithItems);
  const latest_bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 5').all();
  res.json({ totals, latest_orders, latest_bookings });
});

app.use(express.static(distDir));
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error.' });
});

app.listen(PORT, () => {
  console.log(`Aurora Table API running at http://127.0.0.1:${PORT}`);
});
