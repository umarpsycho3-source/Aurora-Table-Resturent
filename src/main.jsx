import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  CalendarDays,
  Check,
  ChefHat,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu as MenuIcon,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Trash2,
  Truck,
  User,
  Utensils
} from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:5000/api' : '/api');
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '94771813023';
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'umarxgamer04@gmail.com';
const DISPLAY_PHONE = '+94 77 181 3023';
const LKR_PER_USD = Number(import.meta.env.VITE_LKR_PER_USD || 300);

const getStoredCurrency = () => localStorage.getItem('currency') === 'LKR' ? 'LKR' : 'USD';

const money = (value, currency = getStoredCurrency()) => {
  const amount = Number(value || 0) * (currency === 'LKR' ? LKR_PER_USD : 1);
  return new Intl.NumberFormat(currency === 'LKR' ? 'en-LK' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'LKR' ? 0 : 2,
    maximumFractionDigits: currency === 'LKR' ? 0 : 2
  }).format(amount);
};

const TABLE_OPTIONS = [
  {
    id: 'Chef Table',
    title: 'Chef Table',
    area: 'Open kitchen counter',
    capacity: '2-6 guests',
    fee: 18,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
    description: 'Front-row view of the grill, plating station, and chef recommendations.'
  },
  {
    id: 'Window Table',
    title: 'Window Table',
    area: 'Garden glass wall',
    capacity: '2-4 guests',
    fee: 8,
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80',
    description: 'A soft-lit table near the windows for date nights and relaxed dinners.'
  },
  {
    id: 'Family Booth',
    title: 'Family Booth',
    area: 'Private booth lane',
    capacity: '4-8 guests',
    fee: 12,
    image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=900&q=80',
    description: 'Comfort seating with extra space for sharing plates and celebrations.'
  },
  {
    id: 'Terrace Lounge',
    title: 'Terrace Lounge',
    area: 'Outdoor terrace',
    capacity: '2-10 guests',
    fee: 15,
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=900&q=80',
    description: 'Open-air seating with low lounge chairs, late-night drinks, and skyline air.'
  },
  {
    id: 'Private Dining Room',
    title: 'Private Dining Room',
    area: 'Enclosed event room',
    capacity: '8-20 guests',
    fee: 35,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    description: 'A separate room for birthdays, business dinners, and special events.'
  }
];

const SERVICE_OPTIONS = [
  'A la carte',
  'Chef tasting menu',
  'Birthday setup',
  'Anniversary setup',
  'Business dinner',
  'Family sharing menu'
];

const TIME_SLOTS = ['11:30', '12:30', '13:30', '18:00', '18:45', '19:30', '20:15', '21:00', '21:45'];

const FALLBACK_MENU = [
  ['Sri Lankan Chicken Curry', 'Curry Bowls', 16, 'Roasted spice chicken curry with coconut gravy, rice, and sambol.', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80'],
  ['Jaffna Prawn Curry', 'Curry Bowls', 22, 'Prawns cooked with chili, tamarind, coconut milk, and lime.', 'https://images.unsplash.com/photo-1604908176997-4316c288032e?auto=format&fit=crop&w=900&q=80'],
  ['Black Pork Curry', 'Curry Bowls', 19, 'Dark roasted pork curry with goraka, pepper, curry leaves, and yellow rice.', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=80'],
  ['Cashew Vegetable Curry', 'Curry Bowls', 14, 'Creamy cashew vegetable curry with coconut, turmeric, and steamed rice.', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80'],
  ['Mango Passion Juice', 'Fresh Juices', 6, 'Fresh mango, passion fruit, lime, and crushed ice.', 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=80'],
  ['Watermelon Mint Juice', 'Fresh Juices', 5, 'Cold watermelon with mint, lime, and sea salt.', 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80'],
  ['Pineapple Ginger Juice', 'Fresh Juices', 6, 'Pineapple juice with ginger, lime, and soda sparkle.', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80'],
  ['Avocado Honey Smoothie', 'Fresh Juices', 7, 'Avocado blended with milk, honey, vanilla, and ice.', 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=900&q=80'],
  ['Egg Fried Rice', 'Rice & Noodles', 11, 'Wok-fried rice with egg, spring onion, carrot, soy, and chili paste.', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80'],
  ['Seafood Nasi Goreng', 'Rice & Noodles', 18, 'Spicy fried rice with prawns, squid, egg, sambal, and crispy shallots.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80'],
  ['Ember Grilled Ribeye', 'Grill', 34, 'Dry-aged ribeye with pepper glaze, garlic mash, and greens.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80'],
  ['Miso Caramel Cheesecake', 'Dessert', 11, 'Silky cheesecake with miso caramel and sesame praline.', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80']
].map(([name, category, price, description, image_url], index) => ({
  id: 9000 + index,
  name,
  category,
  price,
  description,
  image_url,
  is_available: true
}));

const openWhatsApp = (message) => {
  const phone = String(WHATSAPP_NUMBER).replace(/\D/g, '');
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
};

const api = async (path, options = {}, token) => {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
  } catch {
    throw new Error('Backend is not reachable. Run npm run dev so the API starts on port 5000.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

function App() {
  const [page, setPage] = useState(location.hash.replace('#', '') || 'home');
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [auth, setAuth] = useState(() => JSON.parse(localStorage.getItem('auth') || 'null'));
  const [authOpen, setAuthOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const [currency, setCurrencyState] = useState(() => getStoredCurrency());

  const token = auth?.token;

  const setCurrency = (nextCurrency) => {
    localStorage.setItem('currency', nextCurrency);
    setCurrencyState(nextCurrency);
  };

  useEffect(() => {
    const onHash = () => setPage(location.hash.replace('#', '') || 'home');
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (auth) localStorage.setItem('auth', JSON.stringify(auth));
    else localStorage.removeItem('auth');
  }, [auth]);

  const loadMenu = async () => {
    const data = await api('/menu');
    setMenu(data.items?.length ? data.items : FALLBACK_MENU);
  };

  useEffect(() => {
    loadMenu().catch((err) => {
      setMenu(FALLBACK_MENU);
      setNotice({ type: 'error', text: err.message });
    });
  }, []);

  const addToCart = (item) => {
    setCart((current) => {
      const existing = current.find((line) => line.id === item.id);
      if (existing) return current.map((line) => line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, { ...item, quantity: 1 }];
    });
    setNotice({ type: 'success', text: `${item.name} added to cart.` });
  };

  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = subtotal === 0 || subtotal >= 60 ? 0 : 4.5;
    return { subtotal, delivery, total: subtotal + delivery };
  }, [cart]);

  const navigate = (next) => {
    location.hash = next;
    setPage(next);
    scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logout = () => {
    setAuth(null);
    setNotice({ type: 'success', text: 'You are logged out.' });
    navigate('home');
  };

  return (
    <>
      <Header page={page} navigate={navigate} cartCount={cart.reduce((n, item) => n + item.quantity, 0)} auth={auth} openAuth={() => setAuthOpen(true)} logout={logout} currency={currency} setCurrency={setCurrency} />
      {notice && <Toast notice={notice} onClose={() => setNotice(null)} />}
      <main>
        {page === 'home' && <Home navigate={navigate} addFeatured={() => menu[0] && addToCart(menu[0])} />}
        {page === 'menu' && <MenuPage menu={menu} addToCart={addToCart} navigate={navigate} />}
        {page === 'cart' && <CartPage cart={cart} setCart={setCart} totals={cartTotals} navigate={navigate} />}
        {page === 'checkout' && <CheckoutPage cart={cart} totals={cartTotals} token={token} auth={auth} setCart={setCart} setNotice={setNotice} navigate={navigate} />}
        {page === 'book' && <BookingPage token={token} auth={auth} setNotice={setNotice} />}
        {page === 'contact' && <ContactPage setNotice={setNotice} />}
        {page === 'reviews' && <ReviewsPage auth={auth} setNotice={setNotice} />}
        {page === 'account' && <AccountPage auth={auth} token={token} openAuth={() => setAuthOpen(true)} setNotice={setNotice} />}
        {page === 'admin' && <AdminPage auth={auth} token={token} openAuth={() => setAuthOpen(true)} setNotice={setNotice} refreshMenu={loadMenu} navigate={navigate} />}
        {page === 'admin-orders' && <AdminRecordsPage title="Orders" type="orders" auth={auth} token={token} openAuth={() => setAuthOpen(true)} setNotice={setNotice} />}
        {page === 'admin-bookings' && <AdminRecordsPage title="Bookings" type="bookings" auth={auth} token={token} openAuth={() => setAuthOpen(true)} setNotice={setNotice} />}
        {page === 'admin-requests' && <AdminRequestsPage auth={auth} token={token} openAuth={() => setAuthOpen(true)} setNotice={setNotice} />}
      </main>
      <Footer navigate={navigate} />
      {authOpen && <AuthModal close={() => setAuthOpen(false)} setAuth={setAuth} setNotice={setNotice} />}
    </>
  );
}

function Header({ page, navigate, cartCount, auth, openAuth, logout, currency, setCurrency }) {
  const [open, setOpen] = useState(false);
  const isAdmin = auth?.user?.role === 'admin';
  const adminPages = ['admin', 'admin-orders', 'admin-bookings', 'admin-requests'];
  const links = [
    ['home', 'Home'],
    ['menu', 'Menu'],
    ['book', 'Book'],
    ['contact', 'Contact'],
    ['reviews', 'Reviews'],
    ...(auth && !isAdmin ? [['account', 'My Orders']] : []),
    ...(!auth ? [['admin', 'Admin']] : [])
  ];
  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigate('home')} aria-label="Aurora Table home">
        <span><ChefHat size={22} /></span>
        Aurora Table
      </button>
      <button className="icon-button mobile-only" onClick={() => setOpen(!open)} aria-label="Open navigation"><MenuIcon /></button>
      <nav className={open ? 'open' : ''}>
        {links.map(([id, label]) => (
          <button key={id} className={page === id ? 'active' : ''} onClick={() => { navigate(id); setOpen(false); }}>{label}</button>
        ))}
        {isAdmin && (
          <label className={`nav-select ${adminPages.includes(page) ? 'active' : ''}`}>
            <span>Manage</span>
            <select value={adminPages.includes(page) ? page : 'admin'} onChange={(event) => { navigate(event.target.value); setOpen(false); }}>
              <option value="admin">Dashboard</option>
              <option value="admin-orders">Orders</option>
              <option value="admin-bookings">Bookings</option>
              <option value="admin-requests">Requests</option>
            </select>
          </label>
        )}
      </nav>
      <div className="header-actions">
        <label className="currency-switch">
          <span>Currency</span>
          <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
            <option value="USD">USD</option>
            <option value="LKR">LKR</option>
          </select>
        </label>
        <button className="icon-button cart-button" onClick={() => navigate('cart')} aria-label="Open cart">
          <ShoppingBag />
          {cartCount > 0 && <b>{cartCount}</b>}
        </button>
        {auth ? (
          <>
            <span className="user-chip"><User size={15} />{auth.user.name}</span>
            <button className="icon-button" onClick={logout} aria-label="Logout"><LogOut /></button>
          </>
        ) : (
          <button className="pill-button" onClick={openAuth}>Login</button>
        )}
      </div>
    </header>
  );
}

function Toast({ notice, onClose }) {
  useEffect(() => {
    const id = setTimeout(onClose, 4200);
    return () => clearTimeout(id);
  }, [onClose]);
  return <div className={`toast ${notice.type}`}><Check size={18} />{notice.text}</div>;
}

function Home({ navigate, addFeatured }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ count: 0, average: 0 });

  useEffect(() => {
    api('/reviews')
      .then((data) => {
        setReviews((data.reviews || []).slice(0, 3));
        setSummary(data.summary || { count: 0, average: 0 });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={16} /> Colombo night dining, reimagined</span>
          <h1>Aurora Table</h1>
          <p>Modern fire-kissed plates, luminous cocktails, and fast online ordering for nights that deserve a little ceremony.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => navigate('menu')}>Order now</button>
            <button className="secondary" onClick={() => navigate('book')}>Reserve table</button>
          </div>
        </div>
        <div className="hero-plate" aria-label="Featured dish">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85" alt="Elegant restaurant table with colorful dishes" />
          <button onClick={addFeatured}><Plus size={18} /> Add chef pick</button>
        </div>
      </section>
      <section className="offer-band">
        {[
          ['Sunset tasting', 'Five-course tasting menu every Friday with paired zero-proof drinks.'],
          ['Free delivery', 'Delivery is on us for online orders above $60.'],
          ['Private events', 'Chef-led menus for birthdays, launches, and intimate dinners.']
        ].map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
      </section>
      <section className="story-section">
        <div>
          <span className="eyebrow">The room</span>
          <h2>Glass, flame, spice, and late-evening glow.</h2>
        </div>
        <p>Our menu blends Sri Lankan rhythm with global technique: charcoal grill, coastal seafood, garden-forward bowls, and desserts with a small rebellious streak.</p>
      </section>
      <section className="home-reviews">
        <div className="section-heading">
          <span className="eyebrow"><Star size={15} /> Customer reviews</span>
          <h2>What guests are saying.</h2>
          <p>{summary.count ? `${summary.average} average rating from ${summary.count} review${summary.count === 1 ? '' : 's'}.` : 'Reviews from guests will appear here after they share their experience.'}</p>
        </div>
        <div className="home-review-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.id}>
              <div>
                <strong>{review.title}</strong>
                <span>{review.name}</span>
              </div>
              <div className="stars-row" aria-label={`${review.rating} star rating`}>
                {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} className={review.rating >= star ? 'filled' : ''} />)}
              </div>
              <p>{review.message}</p>
            </article>
          ))}
          {!reviews.length && <div className="empty-state">No customer reviews yet.</div>}
        </div>
        <button className="secondary" onClick={() => navigate('reviews')}>Read and add reviews</button>
      </section>
    </>
  );
}

function MenuPage({ menu, addToCart, navigate }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const categories = ['All', ...new Set(menu.map((item) => item.category))];
  const visible = (category === 'All' ? menu : menu.filter((item) => item.category === category))
    .filter((item) => `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(query.toLowerCase()));
  const orderNow = (item) => {
    addToCart(item);
    navigate('cart');
  };
  return (
    <section className="page-shell">
      <div className="section-heading">
        <span className="eyebrow"><Utensils size={15} /> Menu</span>
        <h2>Crafted plates, ready for the table or your doorstep.</h2>
        <p>Browse signature plates, seafood, grill items, small plates, desserts, drinks, and sides with real prices and photos.</p>
      </div>
      <div className="menu-tools">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search foods, drinks, desserts..." />
        <strong>{visible.length} items</strong>
      </div>
      <div className="segmented">
        {categories.map((cat) => <button className={cat === category ? 'active' : ''} key={cat} onClick={() => setCategory(cat)}>{cat}</button>)}
      </div>
      <div className="menu-grid">
        {visible.map((item) => (
          <article className="menu-card" key={item.id}>
            <img src={item.image_url} alt={item.name} />
            <div>
              <span>{item.category}</span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <footer>
                <strong>{money(item.price)}</strong>
                <div className="menu-actions">
                  <button onClick={() => addToCart(item)} disabled={!item.is_available}><Plus size={16} /> Add</button>
                  <button className="order-action" onClick={() => orderNow(item)} disabled={!item.is_available}>Order</button>
                </div>
              </footer>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CartPage({ cart, setCart, totals, navigate }) {
  const updateQuantity = (id, delta) => {
    setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };
  return (
    <section className="page-shell cart-layout">
      <div>
        <div className="section-heading">
          <span className="eyebrow"><ShoppingBag size={15} /> Cart</span>
          <h2>Your order</h2>
        </div>
        {cart.length === 0 ? (
          <div className="empty-state">Your cart is waiting for something delicious.</div>
        ) : (
          <div className="cart-list">
            {cart.map((item) => (
              <article className="cart-row" key={item.id}>
                <img src={item.image_url} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>{money(item.price)}</p>
                </div>
                <div className="stepper">
                  <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus size={14} /></button>
                  <strong>{item.quantity}</strong>
                  <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity"><Plus size={14} /></button>
                </div>
                <strong>{money(item.price * item.quantity)}</strong>
                <button className="icon-button" onClick={() => setCart(cart.filter((line) => line.id !== item.id))} aria-label="Remove item"><Trash2 /></button>
              </article>
            ))}
          </div>
        )}
      </div>
      <OrderSummary totals={totals} disabled={!cart.length} onCheckout={() => navigate('checkout')} />
    </section>
  );
}

function OrderSummary({ totals, disabled, onCheckout }) {
  return (
    <aside className="summary-card">
      <h3>Order summary</h3>
      <p><span>Subtotal</span><strong>{money(totals.subtotal)}</strong></p>
      <p><span>Delivery</span><strong>{money(totals.delivery)}</strong></p>
      <div><span>Total</span><strong>{money(totals.total)}</strong></div>
      <button className="primary full" disabled={disabled} onClick={onCheckout}>Checkout</button>
    </aside>
  );
}

function CheckoutPage({ cart, totals, token, auth, setCart, setNotice, navigate }) {
  const [form, setForm] = useState({
    customer_name: auth?.user?.name || '',
    email: auth?.user?.email || '',
    phone: auth?.user?.phone || '',
    fulfillment_method: 'delivery',
    address: '',
    location_link: '',
    notes: '',
    payment_method: 'card',
    card_name: '',
    card_number: '',
    card_expiry: '',
    card_cvc: ''
  });
  const [loading, setLoading] = useState(false);
  const checkoutTotals = useMemo(() => {
    const delivery = form.fulfillment_method === 'pickup' ? 0 : totals.delivery;
    return { ...totals, delivery, total: totals.subtotal + delivery };
  }, [form.fulfillment_method, totals]);
  const cashLabel = form.fulfillment_method === 'pickup' ? 'Cash at pickup' : 'Cash on delivery';
  useEffect(() => {
    if (!auth?.user) return;
    setForm((current) => ({
      ...current,
      customer_name: current.customer_name || auth.user.name || '',
      email: current.email || auth.user.email || '',
      phone: current.phone || auth.user.phone || ''
    }));
  }, [auth]);
  const submit = async (event) => {
    event.preventDefault();
    if (!cart.length) return setNotice({ type: 'error', text: 'Your cart is empty.' });
    if (form.fulfillment_method === 'delivery' && !form.address.trim()) {
      return setNotice({ type: 'error', text: 'Add a delivery address or choose pickup.' });
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        items: cart.map((item) => ({ menu_item_id: item.id, quantity: item.quantity }))
      };
      const data = await api('/orders', { method: 'POST', body: JSON.stringify(payload) }, token);
      const lines = cart.map((item) => `${item.quantity} x ${item.name}`).join('\n');
      const location = form.fulfillment_method === 'pickup'
        ? 'Customer will pick up at the restaurant'
        : `${form.address}${form.location_link ? `\nMap: ${form.location_link}` : ''}`;
      openWhatsApp(`New Aurora Table order\nName: ${form.customer_name}\nPhone: ${form.phone}\nService: ${form.fulfillment_method}\nLocation: ${location}\nItems:\n${lines}\nTotal: ${money(checkoutTotals.total)}\nPayment: ${form.payment_method === 'cash' ? cashLabel : 'Card payment'}`);
      setCart([]);
      setNotice({ type: 'success', text: `Order #${data.order.id} placed and WhatsApp opened.` });
      navigate('menu');
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="page-shell checkout-layout">
      <FormCard title="Checkout" eyebrow={<><CreditCard size={15} /> Payment</>} onSubmit={submit}>
        {auth?.user && <div className="account-note"><User size={17} />Ordering as {auth.user.name} / {auth.user.email} / {auth.user.phone}</div>}
        <Field label="Name" value={form.customer_name} onChange={(v) => setForm({ ...form, customer_name: v })} required />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
        <div className="payment-options">
          <label><input type="radio" checked={form.fulfillment_method === 'delivery'} onChange={() => setForm({ ...form, fulfillment_method: 'delivery' })} /> <Truck size={17} /> Delivery</label>
          <label><input type="radio" checked={form.fulfillment_method === 'pickup'} onChange={() => setForm({ ...form, fulfillment_method: 'pickup', address: '' })} /> <Store size={17} /> Shop pickup</label>
        </div>
        {form.fulfillment_method === 'delivery' ? (
          <>
            <Field label="Delivery address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
            <Field label="Google Maps location link" value={form.location_link} onChange={(v) => setForm({ ...form, location_link: v })} placeholder="Paste customer location link" />
          </>
        ) : (
          <div className="account-note"><Store size={17} />Customer will collect the order at Aurora Table and can pay cash at pickup.</div>
        )}
        <Field label="Order notes" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} textarea />
        <div className="payment-options">
          <label><input type="radio" checked={form.payment_method === 'card'} onChange={() => setForm({ ...form, payment_method: 'card' })} /> Card payment</label>
          <label><input type="radio" checked={form.payment_method === 'cash'} onChange={() => setForm({ ...form, payment_method: 'cash' })} /> {cashLabel}</label>
        </div>
        {form.payment_method === 'card' && (
          <div className="card-ui">
            <Field label="Cardholder name" value={form.card_name} onChange={(v) => setForm({ ...form, card_name: v })} required />
            <Field label="Card number" value={form.card_number} onChange={(v) => setForm({ ...form, card_number: v })} placeholder="4242 4242 4242 4242" required />
            <div className="two-col">
              <Field label="Expiry" value={form.card_expiry} onChange={(v) => setForm({ ...form, card_expiry: v })} placeholder="MM/YY" required />
              <Field label="CVC" value={form.card_cvc} onChange={(v) => setForm({ ...form, card_cvc: v })} required />
            </div>
          </div>
        )}
        <button className="primary full" disabled={loading}>{loading ? 'Placing order...' : 'Place order and open WhatsApp'}</button>
      </FormCard>
      <OrderSummary totals={checkoutTotals} disabled={!cart.length} onCheckout={() => {}} />
    </section>
  );
}

function BookingPage({ token, auth, setNotice }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    name: auth?.user?.name || '',
    email: auth?.user?.email || '',
    phone: auth?.user?.phone || '',
    booking_date: today,
    booking_time: '19:30',
    guests: 2,
    table_type: TABLE_OPTIONS[0].id,
    service_style: SERVICE_OPTIONS[0],
    seating_area: TABLE_OPTIONS[0].area,
    occasion: 'Casual dinner',
    table_fee: TABLE_OPTIONS[0].fee,
    special_request: ''
  });
  const [loading, setLoading] = useState(false);
  const selectedTable = TABLE_OPTIONS.find((table) => table.id === form.table_type) || TABLE_OPTIONS[0];
  useEffect(() => {
    if (!auth?.user) return;
    setForm((current) => ({
      ...current,
      name: current.name || auth.user.name || '',
      email: current.email || auth.user.email || '',
      phone: current.phone || auth.user.phone || ''
    }));
  }, [auth]);
  const chooseTable = (table) => {
    setForm({
      ...form,
      table_type: table.id,
      seating_area: table.area,
      table_fee: table.fee
    });
  };
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await api('/bookings', { method: 'POST', body: JSON.stringify(form) }, token);
      openWhatsApp(`Aurora Table booking request\nName: ${form.name}\nPhone: ${form.phone}\nDate: ${form.booking_date}\nTime: ${form.booking_time}\nGuests: ${form.guests}\nTable: ${form.table_type}\nArea: ${form.seating_area}\nService: ${form.service_style}\nOccasion: ${form.occasion}\nTable fee: ${money(form.table_fee)}\nRequest: ${form.special_request || 'None'}`);
      setNotice({ type: 'success', text: `Booking #${data.booking.id} saved and WhatsApp opened.` });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="page-shell booking-page">
      <div className="section-heading">
        <span className="eyebrow"><CalendarDays size={15} /> Booking</span>
        <h2>Choose the table, service, time, and occasion.</h2>
        <p>Select a real table style with photos, then send the full reservation to WhatsApp after saving it in the database.</p>
      </div>
      <div className="table-grid">
        {TABLE_OPTIONS.map((table) => (
          <button type="button" className={`table-card ${form.table_type === table.id ? 'active' : ''}`} key={table.id} onClick={() => chooseTable(table)}>
            <img src={table.image} alt={table.title} />
            <span>{table.capacity}</span>
            <strong>{table.title}</strong>
            <p>{table.description}</p>
            <b>{table.area} / {money(table.fee)} table service</b>
          </button>
        ))}
      </div>
      <div className="booking-layout">
        <FormCard title="Reservation details" eyebrow={<><CalendarDays size={15} /> Details</>} onSubmit={submit}>
          {auth?.user && <div className="account-note"><User size={17} />Booking as {auth.user.name} / {auth.user.email} / {auth.user.phone}</div>}
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
          <div className="two-col">
            <Field label="Date" type="date" min={today} value={form.booking_date} onChange={(v) => setForm({ ...form, booking_date: v })} required />
            <Field label="Guests" type="number" min="1" max="20" value={form.guests} onChange={(v) => setForm({ ...form, guests: v })} required />
          </div>
          <div className="time-slots">
            <span>Time</span>
            <div>
              {TIME_SLOTS.map((slot) => (
                <button type="button" className={form.booking_time === slot ? 'active' : ''} key={slot} onClick={() => setForm({ ...form, booking_time: slot })}>{slot}</button>
              ))}
            </div>
          </div>
          <label className="field">
            <span>Service type</span>
            <select value={form.service_style} onChange={(event) => setForm({ ...form, service_style: event.target.value })}>
              {SERVICE_OPTIONS.map((service) => <option key={service} value={service}>{service}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Occasion</span>
            <select value={form.occasion} onChange={(event) => setForm({ ...form, occasion: event.target.value })}>
              {['Casual dinner', 'Birthday', 'Anniversary', 'Business meeting', 'Date night', 'Family celebration'].map((occasion) => <option key={occasion} value={occasion}>{occasion}</option>)}
            </select>
          </label>
          <Field label="Special request" value={form.special_request} onChange={(v) => setForm({ ...form, special_request: v })} textarea />
          <button className="primary full" disabled={loading}>{loading ? 'Saving...' : 'Book table and open WhatsApp'}</button>
        </FormCard>
        <aside className="booking-summary">
          <img src={selectedTable.image} alt={selectedTable.title} />
          <div>
            <span className="eyebrow">Selected table</span>
            <h3>{selectedTable.title}</h3>
            <p>{selectedTable.description}</p>
            <ul>
              <li><strong>Area</strong><span>{form.seating_area}</span></li>
              <li><strong>Guests</strong><span>{form.guests}</span></li>
              <li><strong>Time</strong><span>{form.booking_date} at {form.booking_time}</span></li>
              <li><strong>Service</strong><span>{form.service_style}</span></li>
              <li><strong>Table fee</strong><span>{money(form.table_fee)}</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ContactPage({ setNotice }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api('/contact', { method: 'POST', body: JSON.stringify(form) });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setNotice({ type: 'success', text: 'Message sent. The team will reply soon.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="page-shell split-layout">
      <FormCard title="Talk to the team" eyebrow={<><MessageCircle size={15} /> Contact</>} onSubmit={submit}>
        <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
        <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
        <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} required />
        <Field label="Message" value={form.message} onChange={(v) => setForm({ ...form, message: v })} textarea required />
        <button className="primary full" disabled={loading}>{loading ? 'Sending...' : 'Send message'}</button>
      </FormCard>
      <div className="contact-panel">
        <h3>Aurora Table</h3>
        <p>42 Galle Road, Colombo</p>
        <p>Open daily 11:30 AM - 11:30 PM</p>
        <p><MessageCircle size={16} /> {DISPLAY_PHONE}</p>
        <p><Mail size={16} /> {CONTACT_EMAIL}</p>
        <div className="contact-actions">
          <button className="secondary" onClick={() => openWhatsApp('Hello Aurora Table, I would like to ask about your restaurant.')}>WhatsApp us</button>
          <a className="secondary" href={`mailto:${CONTACT_EMAIL}`}>Email us</a>
        </div>
      </div>
    </section>
  );
}

function ReviewsPage({ auth, setNotice }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ count: 0, average: 0 });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: auth?.user?.name || '',
    email: auth?.user?.email || '',
    rating: 5,
    title: '',
    message: ''
  });

  const loadReviews = async () => {
    const data = await api('/reviews');
    setReviews(data.reviews || []);
    setSummary(data.summary || { count: 0, average: 0 });
  };

  useEffect(() => {
    loadReviews().catch((err) => setNotice({ type: 'error', text: err.message }));
  }, []);

  useEffect(() => {
    if (!auth?.user) return;
    setForm((current) => ({
      ...current,
      name: current.name || auth.user.name || '',
      email: current.email || auth.user.email || ''
    }));
  }, [auth]);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api('/reviews', { method: 'POST', body: JSON.stringify(form) });
      setForm({ name: auth?.user?.name || '', email: auth?.user?.email || '', rating: 5, title: '', message: '' });
      await loadReviews();
      setNotice({ type: 'success', text: 'Thank you. Your review was added.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell reviews-page">
      <div className="section-heading">
        <span className="eyebrow"><Star size={15} /> Reviews</span>
        <h2>Share your dining experience.</h2>
        <p>Rate the food, service, delivery, pickup, or booking experience and help new guests choose with confidence.</p>
      </div>
      <div className="reviews-layout">
        <FormCard title="Add a review" eyebrow={<><Star size={15} /> Rating</>} onSubmit={submit}>
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <div className="rating-picker">
            <span>Rating</span>
            <div>
              {[1, 2, 3, 4, 5].map((rating) => (
                <button type="button" key={rating} className={form.rating >= rating ? 'active' : ''} onClick={() => setForm({ ...form, rating })} aria-label={`${rating} star rating`}>
                  <Star size={20} />
                </button>
              ))}
            </div>
            <strong>{form.rating === 5 ? 'Excellent' : form.rating === 4 ? 'Good' : form.rating === 3 ? 'Okay' : form.rating === 2 ? 'Needs work' : 'Poor'}</strong>
          </div>
          <Field label="Review title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Great food and fast delivery" required />
          <Field label="Review" value={form.message} onChange={(v) => setForm({ ...form, message: v })} textarea required />
          <button className="primary full" disabled={loading}>{loading ? 'Saving review...' : 'Submit review'}</button>
        </FormCard>
        <div className="reviews-panel">
          <div className="review-score">
            <strong>{summary.average ? summary.average : '0.0'}</strong>
            <span>{summary.count} review{summary.count === 1 ? '' : 's'}</span>
            <div className="stars-row" aria-label={`${summary.average} average rating`}>
              {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={18} className={summary.average >= star ? 'filled' : ''} />)}
            </div>
          </div>
          <div className="review-list">
            {reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div>
                  <strong>{review.title}</strong>
                  <span>{review.name}</span>
                </div>
                <div className="stars-row" aria-label={`${review.rating} star rating`}>
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} className={review.rating >= star ? 'filled' : ''} />)}
                </div>
                <p>{review.message}</p>
              </article>
            ))}
            {!reviews.length && <div className="empty-state">No reviews yet. Be the first to rate Aurora Table.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

function AccountPage({ auth, token, openAuth, setNotice }) {
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    Promise.all([
      api('/my/orders', {}, token),
      api('/my/bookings', {}, token)
    ])
      .then(([orderData, bookingData]) => {
        setOrders(orderData.orders);
        setBookings(bookingData.bookings);
      })
      .catch((err) => setNotice({ type: 'error', text: err.message }))
      .finally(() => setLoading(false));
  }, [auth, token]);

  if (!auth) {
    return (
      <section className="page-shell">
        <div className="empty-state">
          <h2>My orders and bookings</h2>
          <p>Login to see your own table bookings and menu orders.</p>
          <button className="primary" onClick={openAuth}>Login</button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell account-page">
      <div className="section-heading">
        <span className="eyebrow"><User size={15} /> Account</span>
        <h2>My orders and table bookings</h2>
        <p>{auth.user.name} / {auth.user.email} / {auth.user.phone}</p>
      </div>
      {loading && <div className="empty-state">Loading your account activity...</div>}
      <div className="account-grid">
        <section className="admin-panel">
          <h3>Menu orders</h3>
          <div className="data-table">
            {orders.map((order) => (
              <article key={order.id}>
                <div>
                  <strong>Order #{order.id} / {order.status}</strong>
                  <span>{order.items.map((item) => `${item.quantity} x ${item.name}`).join(', ')}</span>
                </div>
                <strong>{money(order.total)}</strong>
              </article>
            ))}
            {!orders.length && !loading && <p className="hint">No orders yet.</p>}
          </div>
        </section>
        <section className="admin-panel">
          <h3>Table bookings</h3>
          <div className="data-table">
            {bookings.map((booking) => (
              <article key={booking.id}>
                <div>
                  <strong>Booking #{booking.id} / {booking.status}</strong>
                  <span>{booking.table_type} / {booking.service_style} / {booking.guests} guests</span>
                </div>
                <span>{booking.booking_date} {booking.booking_time}</span>
              </article>
            ))}
            {!bookings.length && !loading && <p className="hint">No bookings yet.</p>}
          </div>
        </section>
      </div>
    </section>
  );
}

function FormCard({ eyebrow, title, children, onSubmit }) {
  return (
    <form className="form-card" onSubmit={onSubmit}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children}
    </form>
  );
}

function Field({ label, value, onChange, textarea, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} {...props} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} {...props} />
      )}
    </label>
  );
}

function AuthModal({ close, setAuth, setNotice }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const data = await api(path, { method: 'POST', body: JSON.stringify(form) });
      setAuth(data);
      setNotice({ type: 'success', text: `Welcome, ${data.user.name}.` });
      close();
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <form className="auth-modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-top">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
          <button type="button" className="icon-button" onClick={close}>x</button>
        </div>
        {mode === 'register' && <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />}
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
        {mode === 'register' && <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />}
        <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} minLength="8" required />
        <button className="primary full" disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}</button>
        <button type="button" className="link-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Need an account?' : 'Already registered?'}
        </button>
      </form>
    </div>
  );
}

function AdminPage({ auth, token, openAuth, setNotice, refreshMenu, navigate }) {
  const [dashboard, setDashboard] = useState(null);
  const [menu, setMenu] = useState([]);
  const [editing, setEditing] = useState(null);
  const isAdmin = auth?.user?.role === 'admin';

  const load = async () => {
    const [dash, menuData] = await Promise.all([
      api('/admin/dashboard', {}, token),
      api('/menu')
    ]);
    setDashboard(dash);
    setMenu(menuData.items);
  };

  useEffect(() => {
    if (isAdmin) load().catch((err) => setNotice({ type: 'error', text: err.message }));
  }, [isAdmin]);

  const saveMenu = async (item) => {
    try {
      const method = item.id ? 'PUT' : 'POST';
      const path = item.id ? `/menu/${item.id}` : '/menu';
      await api(path, { method, body: JSON.stringify(item) }, token);
      setEditing(null);
      await Promise.all([load(), refreshMenu()]);
      setNotice({ type: 'success', text: 'Menu saved.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    }
  };

  const removeMenu = async (id) => {
    try {
      await api(`/menu/${id}`, { method: 'DELETE' }, token);
      await Promise.all([load(), refreshMenu()]);
      setNotice({ type: 'success', text: 'Menu item deleted.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    }
  };

  if (!auth) return <AdminGate openAuth={openAuth} text="Login with the seeded admin account to manage the restaurant." />;
  if (!isAdmin) return <AdminGate openAuth={openAuth} text="This area is protected for admin users only." />;

  return (
    <section className="page-shell admin-shell">
      <div className="section-heading">
        <span className="eyebrow"><LayoutDashboard size={15} /> Admin</span>
        <h2>Restaurant command center</h2>
      </div>
      {dashboard && (
        <div className="stat-grid">
          <Stat label="Orders" value={dashboard.totals.total_orders} />
          <Stat label="Bookings" value={dashboard.totals.total_bookings} />
          <Stat label="Users" value={dashboard.totals.total_users} />
          <Stat label="Revenue" value={money(dashboard.totals.total_revenue)} />
        </div>
      )}
      <div className="admin-actions">
        <button className="secondary" onClick={() => navigate('admin-orders')}><ShoppingBag size={17} /> Check orders</button>
        <button className="secondary" onClick={() => navigate('admin-bookings')}><CalendarDays size={17} /> Check bookings</button>
        <button className="secondary" onClick={() => navigate('admin-requests')}><MessageCircle size={17} /> Client requests</button>
      </div>
      <AdminMenu menu={menu} editing={editing} setEditing={setEditing} saveMenu={saveMenu} removeMenu={removeMenu} />
    </section>
  );
}

function AdminRecordsPage({ title, type, auth, token, openAuth, setNotice }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const isAdmin = auth?.user?.role === 'admin';
  const statuses = type === 'orders'
    ? ['pending', 'preparing', 'completed', 'cancelled']
    : ['pending', 'confirmed', 'completed', 'cancelled'];

  const load = async () => {
    setLoading(true);
    try {
      const data = await api(`/${type}`, {}, token);
      setRows(data[type] || []);
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, type]);

  const updateStatus = async (recordType, id, status) => {
    try {
      await api(`/${recordType}/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token);
      await load();
      setNotice({ type: 'success', text: 'Status updated.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    }
  };

  if (!auth) return <AdminGate openAuth={openAuth} text="Login with the seeded admin account to manage restaurant records." />;
  if (!isAdmin) return <AdminGate openAuth={openAuth} text="This page is protected for admin users only." />;

  return (
    <section className="page-shell admin-shell">
      <div className="section-heading">
        <span className="eyebrow"><LayoutDashboard size={15} /> Admin</span>
        <h2>{title}</h2>
        <p>{type === 'orders' ? 'Check customer orders, delivery locations, payment method, and order status.' : 'Check table bookings and update reservation status.'}</p>
      </div>
      {loading && <div className="empty-state">Loading {title.toLowerCase()}...</div>}
      <AdminTable title={title} rows={rows} type={type} updateStatus={updateStatus} statuses={statuses} />
    </section>
  );
}

function AdminRequestsPage({ auth, token, openAuth, setNotice }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const isAdmin = auth?.user?.role === 'admin';

  const load = async () => {
    setLoading(true);
    try {
      const data = await api('/contact-messages', {}, token);
      setMessages(data.messages || []);
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const updateStatus = async (id, status) => {
    try {
      await api(`/contact-messages/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token);
      await load();
      setNotice({ type: 'success', text: status === 'completed' ? 'Request marked as completed.' : 'Request reopened.' });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    }
  };

  if (!auth) return <AdminGate openAuth={openAuth} text="Login with the seeded admin account to see client requests." />;
  if (!isAdmin) return <AdminGate openAuth={openAuth} text="This page is protected for admin users only." />;

  return (
    <section className="page-shell admin-shell">
      <div className="section-heading">
        <span className="eyebrow"><MessageCircle size={15} /> Requests</span>
        <h2>Client requests and complaints</h2>
        <p>Read messages sent from the contact page and mark them completed after the team handles them.</p>
      </div>
      {loading && <div className="empty-state">Loading client requests...</div>}
      <section className="admin-panel">
        <h3>Contact messages</h3>
        <div className="request-list">
          {messages.map((message) => (
            <article className="request-card" key={message.id}>
              <div>
                <div className="request-topline">
                  <strong>{message.subject}</strong>
                  <span className={`status-pill ${message.status}`}>{message.status === 'completed' ? 'Completed' : 'Open'}</span>
                </div>
                <span>{message.name} / {message.email} / {message.phone}</span>
                <p>{message.message}</p>
                <small>Sent {message.created_at}{message.resolved_at ? ` / completed ${message.resolved_at}` : ''}</small>
              </div>
              <button className={message.status === 'completed' ? 'secondary' : 'primary'} onClick={() => updateStatus(message.id, message.status === 'completed' ? 'open' : 'completed')}>
                <Check size={16} /> {message.status === 'completed' ? 'Reopen' : 'Mark completed'}
              </button>
            </article>
          ))}
          {!messages.length && !loading && <p className="hint">No client requests yet.</p>}
        </div>
      </section>
    </section>
  );
}

function AdminGate({ openAuth, text }) {
  return (
    <section className="page-shell">
      <div className="empty-state">
        <h2>Admin dashboard</h2>
        <p>{text}</p>
        <button className="primary" onClick={openAuth}>Open login</button>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return <article className="stat-card"><span>{label}</span><strong>{value}</strong></article>;
}

function AdminMenu({ menu, editing, setEditing, saveMenu, removeMenu }) {
  const blank = { name: '', category: '', price: '', description: '', image_url: '', is_available: true };
  const [form, setForm] = useState(blank);
  useEffect(() => setForm(editing || blank), [editing]);
  return (
    <section className="admin-panel">
      <div className="admin-panel-top">
        <h3>Menu items</h3>
        <button className="secondary" onClick={() => setEditing(blank)}><Plus size={16} /> Add item</button>
      </div>
      {editing && (
        <form className="admin-form" onSubmit={(event) => { event.preventDefault(); saveMenu(form); }}>
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} required />
          <Field label="Price" type="number" step="0.01" value={form.price} onChange={(v) => setForm({ ...form, price: v })} required />
          <Field label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} required />
          <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea required />
          <label className="check-row"><input type="checkbox" checked={form.is_available} onChange={(event) => setForm({ ...form, is_available: event.target.checked })} /> Available</label>
          <button className="primary">Save item</button>
        </form>
      )}
      <div className="admin-list">
        {menu.map((item) => (
          <article key={item.id}>
            <img src={item.image_url} alt={item.name} />
            <div><strong>{item.name}</strong><span>{item.category} / {money(item.price)}</span></div>
            <button className="secondary" onClick={() => setEditing(item)}>Edit</button>
            <button className="icon-button" onClick={() => removeMenu(item.id)} aria-label="Delete menu item"><Trash2 /></button>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminTable({ title, rows, type, updateStatus, statuses }) {
  const isOrders = type === 'orders';
  return (
    <section className="admin-panel">
      <h3>{title}</h3>
      <div className="data-table">
        {rows.map((row) => (
          <article key={`${type}-${row.id}`}>
            <div>
              <strong>#{row.id} {row.customer_name || row.name}</strong>
              <span>{row.phone} {row.total ? `/ ${money(row.total)}` : `/ ${row.guests} guests on ${row.booking_date} at ${row.booking_time} / ${row.table_type || 'Table'} / ${row.service_style || 'Service'}`}</span>
              {isOrders && (
                <div className="admin-meta">
                  <span>{row.fulfillment_method === 'pickup' ? 'Pickup at restaurant' : `Delivery: ${row.address}`}</span>
                  <span>Payment: {row.payment_method || 'unknown'} / {row.payment_status || 'pending'}</span>
                  {row.location_link ? (
                    <a href={row.location_link} target="_blank" rel="noreferrer"><MapPin size={15} /> Open customer location</a>
                  ) : row.address && row.fulfillment_method !== 'pickup' ? (
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row.address)}`} target="_blank" rel="noreferrer"><MapPin size={15} /> Search address</a>
                  ) : null}
                </div>
              )}
            </div>
            <select value={row.status} onChange={(event) => updateStatus(type, row.id, event.target.value)}>
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </article>
        ))}
        {!rows.length && <p className="hint">No records yet.</p>}
      </div>
    </section>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <strong>Aurora Table</strong>
      <div>
        <button onClick={() => navigate('menu')}>Menu</button>
        <button onClick={() => navigate('book')}>Booking</button>
        <button onClick={() => navigate('contact')}>Contact</button>
        <button onClick={() => navigate('reviews')}>Reviews</button>
      </div>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(<App />);
