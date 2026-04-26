# Aurora Table Full-Stack Restaurant App

Aurora Table is a complete restaurant web application with a React frontend, Express backend, SQLite database, JWT authentication, admin dashboard, table bookings, cart checkout, WhatsApp handoff, contact form, seed data, and payment/email integration structure.

## Features

- Creative responsive restaurant homepage with animated hero, offers, and food photography
- Menu categories, item images, prices, descriptions, and add-to-cart controls
- Expanded seed menu with 36 food and drink items across curries, juices, rice/noodles, signature plates, grill, seafood, plant-forward dishes, desserts, drinks, sides, and small plates
- Cart with quantity updates, item removal, subtotal, delivery charge, and total
- Checkout with card UI, cash on delivery option, database order/payment records, and WhatsApp order message
- Table booking form with table type photos, service style, seating area, occasion, time slots, table fee, validation, database records, and WhatsApp booking message
- Contact form persisted to the database
- Register, login, logout with bcrypt password hashing and JWT sessions
- Admin-only dashboard with total orders, bookings, users, revenue, latest records
- Customer account page where logged-in users can view their own orders and bookings
- Admin menu add/edit/delete
- Admin order and booking status updates
- SQLite tables for users, menu items, orders, order items, bookings, payments, and contact messages
- Email notification structure in `server/services/email.js`, ready to connect to SMTP, Resend, SendGrid, etc.

## Tech Stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express
- Database: SQLite using Node 24 built-in `node:sqlite`
- Auth: JWT plus bcryptjs

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment example:

   ```bash
   copy .env.example .env
   ```

3. Update `.env` as needed. At minimum, change `JWT_SECRET` before production use.

4. Run the app:

   ```bash
   npm run dev
   ```

5. Open the frontend:

   ```text
   http://127.0.0.1:5173
   ```

The API runs at:

```text
http://127.0.0.1:5000
```

## Seed Login

Admin user:

```text
Email: admin@auroratable.test
Password: Admin@12345
```

Sample menu items are inserted automatically the first time the server starts.
The seed process also adds any newly missing seed menu items on later starts.

## Database

The SQLite database is created at:

```text
server/data/restaurant.sqlite
```

Tables are created automatically on startup.

## Payment Integration Notes

The checkout currently stores payment records with provider value `manual-ready`.

- Card payments are marked `paid` to simulate successful checkout.
- Cash on delivery payments are marked `pending`.
- Replace the payment creation section in `server/index.js` with Stripe, PayHere, or another gateway later.
- Keep the existing `payments` table fields: `order_id`, `method`, `provider`, `status`, `amount`, and `reference`.

## WhatsApp

Set the restaurant WhatsApp number in `.env` for the backend and optionally in a frontend `.env` variable:

```text
VITE_WHATSAPP_NUMBER=94771234567
```

The browser opens WhatsApp after successful order or booking submission with customer/order details pre-filled.

## Troubleshooting

If the website shows `Backend is not reachable` or `Failed to fetch`, the frontend is running but the API is not reachable. From the project folder, stop old Node windows/processes and run:

```bash
npm run dev
```

This starts both required services:

```text
Frontend: http://127.0.0.1:5173
Backend:  http://127.0.0.1:5000
```

Do not run only `npm run client:dev` unless the backend is already running separately.

## Production Notes

- Use a strong `JWT_SECRET`
- Configure real email sending in `server/services/email.js`
- Connect real card processing before accepting production card payments
- Serve the Vite build from a production static host or add static serving to Express
- Put the database on durable storage or migrate to MySQL/PostgreSQL for multi-server deployments
