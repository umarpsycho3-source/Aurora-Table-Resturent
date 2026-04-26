import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.join(process.cwd(), 'server', 'data');
fs.mkdirSync(dataDir, { recursive: true });

export const db = new DatabaseSync(path.join(dataDir, 'restaurant.sqlite'));

export const runTransaction = (callback) => {
  db.exec('BEGIN');
  try {
    const result = callback();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
};

const menuSeeds = [
  {
    name: 'Saffron Fire Risotto',
    category: 'Signature Plates',
    price: 24,
    description: 'Creamy arborio rice, charred prawns, saffron butter, preserved lemon, and herb oil.',
    image_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Truffle Kottu Royale',
    category: 'Signature Plates',
    price: 18,
    description: 'A playful Sri Lankan street-food classic with roast chicken, leeks, truffle oil, and crisp roti.',
    image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Ember Grilled Ribeye',
    category: 'Grill',
    price: 34,
    description: 'Dry-aged ribeye, smoked sea salt, pepper glaze, roasted garlic mash, and seasonal greens.',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Coconut Lime Sea Bass',
    category: 'Seafood',
    price: 27,
    description: 'Pan-seared sea bass with coconut-lime veloute, curry leaf oil, and baby vegetables.',
    image_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Garden Nebula Bowl',
    category: 'Plant Forward',
    price: 16,
    description: 'Roasted roots, avocado, quinoa, pickled beet, toasted seeds, and passion fruit vinaigrette.',
    image_url: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Miso Caramel Cheesecake',
    category: 'Dessert',
    price: 11,
    description: 'Silky cheesecake, miso caramel, sesame praline, and vanilla cream.',
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Ruby Hibiscus Fizz',
    category: 'Drinks',
    price: 8,
    description: 'Hibiscus, lime, strawberry, mint, sparkling water, and a salted rim.',
    image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Midnight Espresso Martini',
    category: 'Drinks',
    price: 13,
    description: 'Fresh espresso, vanilla, coffee liqueur, and a velvet foam cap.',
    image_url: 'https://images.unsplash.com/photo-1575023782549-62ca0d244b39?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Crab Curry Claypot',
    category: 'Seafood',
    price: 29,
    description: 'Lagoon crab simmered in roasted curry spice, coconut milk, pandan, and curry leaves.',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Charcoal Chicken Skewers',
    category: 'Grill',
    price: 17,
    description: 'Juicy chicken thigh skewers with smoked paprika, lime, garlic yogurt, and cucumber relish.',
    image_url: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Wagyu Short Rib Bao',
    category: 'Small Plates',
    price: 15,
    description: 'Soft bao with slow-braised short rib, tamarind glaze, pickled carrot, and sesame crunch.',
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Crispy Lotus Tacos',
    category: 'Small Plates',
    price: 12,
    description: 'Lotus root shells with chili jackfruit, avocado cream, coriander, and lime salt.',
    image_url: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Tandoori Cauliflower Steak',
    category: 'Plant Forward',
    price: 19,
    description: 'Whole cauliflower steak, cashew tikka sauce, pomegranate, mint, and charred lime.',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Black Garlic Butter Naan',
    category: 'Sides',
    price: 6,
    description: 'Warm tandoor naan brushed with black garlic butter and flaky sea salt.',
    image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Curry Leaf Fries',
    category: 'Sides',
    price: 7,
    description: 'Crisp hand-cut fries with curry leaf salt, chili mayo, and lime zest.',
    image_url: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Mango Chili Panna Cotta',
    category: 'Dessert',
    price: 10,
    description: 'Coconut panna cotta, mango chili compote, toasted coconut, and basil sugar.',
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Chocolate Cardamom Fondant',
    category: 'Dessert',
    price: 12,
    description: 'Warm dark chocolate fondant with cardamom cream and salted pistachio crumb.',
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Smoked Pineapple Sour',
    category: 'Drinks',
    price: 9,
    description: 'Pineapple, lime, smoked cinnamon, aquafaba foam, and a chili-sugar rim.',
    image_url: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Lychee Rose Cooler',
    category: 'Drinks',
    price: 8,
    description: 'Lychee, rose water, lime, soda, mint, and crushed ice.',
    image_url: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Smoked Tomato Burrata',
    category: 'Small Plates',
    price: 14,
    description: 'Creamy burrata with smoked tomato jam, basil oil, sourdough crisps, and pink pepper.',
    image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Lobster Coconut Linguine',
    category: 'Seafood',
    price: 32,
    description: 'Linguine tossed with lobster, coconut cream, chili, tomato, and fresh herbs.',
    image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Pepper Lamb Chops',
    category: 'Grill',
    price: 31,
    description: 'Double lamb chops with black pepper glaze, eggplant puree, and crisp shallots.',
    image_url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Kombu Mushroom Ramen',
    category: 'Plant Forward',
    price: 18,
    description: 'Deep kombu broth with mushrooms, noodles, bok choy, chili oil, and soy egg option.',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Chef Tasting Box',
    category: 'Signature Plates',
    price: 42,
    description: 'A premium selection of six chef favorites packed for sharing at home.',
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Sri Lankan Chicken Curry',
    category: 'Curry Bowls',
    price: 16,
    description: 'Slow-cooked chicken curry with roasted spices, coconut gravy, basmati rice, and sambol.',
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Jaffna Prawn Curry',
    category: 'Curry Bowls',
    price: 22,
    description: 'Northern-style prawn curry with chili, tamarind, coconut milk, steamed rice, and lime.',
    image_url: 'https://images.unsplash.com/photo-1604908176997-4316c288032e?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Black Pork Curry',
    category: 'Curry Bowls',
    price: 19,
    description: 'Dark roasted pork curry with goraka, pepper, curry leaves, yellow rice, and pickles.',
    image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Cashew Vegetable Curry',
    category: 'Curry Bowls',
    price: 14,
    description: 'Creamy cashew and vegetable curry with coconut, turmeric, beans, carrots, and rice.',
    image_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Mango Passion Juice',
    category: 'Fresh Juices',
    price: 6,
    description: 'Fresh mango, passion fruit, lime, and crushed ice blended to order.',
    image_url: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Watermelon Mint Juice',
    category: 'Fresh Juices',
    price: 5,
    description: 'Cold-pressed watermelon with mint, lime, and a tiny pinch of sea salt.',
    image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Pineapple Ginger Juice',
    category: 'Fresh Juices',
    price: 6,
    description: 'Bright pineapple juice with ginger, lime, and chilled soda sparkle.',
    image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Avocado Honey Smoothie',
    category: 'Fresh Juices',
    price: 7,
    description: 'Creamy avocado blended with milk, honey, vanilla, and crushed ice.',
    image_url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Egg Fried Rice',
    category: 'Rice & Noodles',
    price: 11,
    description: 'Wok-fried rice with egg, spring onion, carrot, soy, sesame, and chili paste.',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Seafood Nasi Goreng',
    category: 'Rice & Noodles',
    price: 18,
    description: 'Spicy fried rice with prawns, squid, egg, sambal, cucumber, and crispy shallots.',
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Chicken Pad Thai',
    category: 'Rice & Noodles',
    price: 15,
    description: 'Rice noodles with chicken, tamarind, egg, peanuts, bean sprouts, and lime.',
    image_url: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Lamprais Parcel',
    category: 'Signature Plates',
    price: 21,
    description: 'Banana-leaf baked rice with curry, frikkadel, eggplant moju, sambol, and gravy.',
    image_url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=900&q=80'
  }
];

export const initDb = () => {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('customer', 'admin')) DEFAULT 'customer',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      is_available INTEGER NOT NULL DEFAULT 1,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      fulfillment_method TEXT NOT NULL CHECK(fulfillment_method IN ('delivery', 'pickup')) DEFAULT 'delivery',
      address TEXT NOT NULL,
      location_link TEXT,
      notes TEXT,
      status TEXT NOT NULL CHECK(status IN ('pending', 'preparing', 'completed', 'cancelled')) DEFAULT 'pending',
      subtotal REAL NOT NULL,
      delivery_charge REAL NOT NULL,
      total REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      line_total REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      booking_date TEXT NOT NULL,
      booking_time TEXT NOT NULL,
      guests INTEGER NOT NULL,
      table_type TEXT NOT NULL DEFAULT 'Chef Table',
      service_style TEXT NOT NULL DEFAULT 'A la carte',
      seating_area TEXT NOT NULL DEFAULT 'Main dining room',
      occasion TEXT NOT NULL DEFAULT 'Casual dinner',
      table_fee REAL NOT NULL DEFAULT 0,
      special_request TEXT,
      status TEXT NOT NULL CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      method TEXT NOT NULL CHECK(method IN ('card', 'cash')),
      provider TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
      amount REAL NOT NULL,
      reference TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('open', 'completed')) DEFAULT 'open',
      resolved_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const menuColumns = db.prepare('PRAGMA table_info(menu_items)').all().map((column) => column.name);
  if (!menuColumns.includes('is_deleted')) {
    db.exec('ALTER TABLE menu_items ADD COLUMN is_deleted INTEGER NOT NULL DEFAULT 0');
  }

  const orderColumns = db.prepare('PRAGMA table_info(orders)').all().map((column) => column.name);
  if (!orderColumns.includes('fulfillment_method')) {
    db.exec("ALTER TABLE orders ADD COLUMN fulfillment_method TEXT NOT NULL DEFAULT 'delivery'");
  }
  if (!orderColumns.includes('location_link')) {
    db.exec("ALTER TABLE orders ADD COLUMN location_link TEXT");
  }

  const bookingColumns = db.prepare('PRAGMA table_info(bookings)').all().map((column) => column.name);
  const bookingMigrations = [
    ['table_type', "ALTER TABLE bookings ADD COLUMN table_type TEXT NOT NULL DEFAULT 'Chef Table'"],
    ['service_style', "ALTER TABLE bookings ADD COLUMN service_style TEXT NOT NULL DEFAULT 'A la carte'"],
    ['seating_area', "ALTER TABLE bookings ADD COLUMN seating_area TEXT NOT NULL DEFAULT 'Main dining room'"],
    ['occasion', "ALTER TABLE bookings ADD COLUMN occasion TEXT NOT NULL DEFAULT 'Casual dinner'"],
    ['table_fee', 'ALTER TABLE bookings ADD COLUMN table_fee REAL NOT NULL DEFAULT 0']
  ];
  for (const [column, sql] of bookingMigrations) {
    if (!bookingColumns.includes(column)) db.exec(sql);
  }

  const contactColumns = db.prepare('PRAGMA table_info(contact_messages)').all().map((column) => column.name);
  if (!contactColumns.includes('status')) {
    db.exec("ALTER TABLE contact_messages ADD COLUMN status TEXT NOT NULL DEFAULT 'open'");
  }
  if (!contactColumns.includes('resolved_at')) {
    db.exec('ALTER TABLE contact_messages ADD COLUMN resolved_at TEXT');
  }

  const ensureAdminUser = ({ name, email, phone, password }) => {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    const passwordHash = bcrypt.hashSync(password, 12);
    if (existing) {
      db.prepare(`
        UPDATE users
        SET name = ?, phone = ?, password_hash = ?, role = 'admin', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(name, phone, passwordHash, existing.id);
      return;
    }
    db.prepare(`
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES (?, ?, ?, ?, 'admin')
    `).run(name, email, phone, passwordHash);
  };

  ensureAdminUser({
    name: 'Aurora Admin',
    email: 'admin@auroratable.test',
    phone: '+94770000000',
    password: 'Admin@12345'
  });
  ensureAdminUser({
    name: 'Umar Admin',
    email: 'umarxgamer04@gmail.com',
    phone: '+971813023',
    password: 'Admin@12345'
  });

  const insertMenu = db.prepare(`
    INSERT INTO menu_items (name, category, price, description, image_url, is_available)
    VALUES (?, ?, ?, ?, ?, 1)
  `);
  const existingByName = db.prepare('SELECT id, is_deleted FROM menu_items WHERE name = ?');
  runTransaction(() => {
    for (const item of menuSeeds) {
      const existing = existingByName.get(item.name);
      if (!existing) {
        insertMenu.run(item.name, item.category, item.price, item.description, item.image_url);
      } else if (existing.is_deleted) {
        db.prepare('UPDATE menu_items SET is_deleted = 0, is_available = 1 WHERE id = ?').run(existing.id);
      }
    }
  });
};
