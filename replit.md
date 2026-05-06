# JugaduBazar — MERN Stack Marketplace

A full-stack MERN marketplace connecting Indian street-food vendors with raw-material suppliers.

## Run & Operate

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server on `:5000` (frontend) |
| `cd backend && npm start` | Production backend |
| `cd backend && npm run dev` | Dev backend with auto-restart on `:3001` |
| `cd backend && npm run seed` | Re-run demo seed |

**Required env vars (backend/.env):**
```
PORT=3001
MONGODB_URI=            # blank = in-memory MongoDB
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
SEED_ON_START=true
STRIPE_SECRET_KEY=      # optional — mock mode if blank
EMAIL_USER=             # optional Gmail sender
EMAIL_PASS=             # optional Gmail App Password
EMAIL_SERVICE=gmail
```

## Stack

- **MongoDB** — in-memory (dev) via `mongodb-memory-server`, Atlas in prod
- **Express + Node 20** — REST API on `:3001`
- **React 18 + Vite + Tailwind** — SPA on `:5000`
- **Stripe** — payment intents (card + UPI); mock mode without key
- **Nodemailer** — OTP emails; logs to console without credentials
- All JS/JSX — no TypeScript

## Where Things Live

```
backend/
├── server.js              # Express entry — mounts all routes
├── config/db.js           # Mongo connection (auto in-memory)
├── middleware/auth.js      # JWT + role guards
├── models/                # User, Material, Order, Notification, SavedItem, CartItem
├── routes/                # auth, materials, orders, notifications, saved, cart, users, payments
├── utils/seed.js          # 53 demo materials across 2 suppliers + 2 vendors
└── utils/email.js         # Nodemailer OTP sender

client/
├── App.jsx                # All SPA routes
├── pages/                 # ~30 page components
├── components/
│   ├── PaymentModal.jsx   # COD + Stripe/UPI payment selection
│   └── ui/                # Radix component library
├── contexts/              # Auth, Cart, Notification, Language
└── lib/api.js             # All fetch calls (authAPI, materialsAPI, ordersAPI, paymentsAPI…)

public/favicon.svg         # Custom shopping-bag + rupee favicon
```

## Architecture Decisions

- Vite proxies `/api/*` → `http://localhost:3001` so frontend uses relative URLs
- JWT stored in `localStorage` via `authToken` helper in `api.js`
- In-memory MongoDB auto-seeded on every backend start (stateless dev)
- Stripe PaymentIntent created server-side; mock response returned when `STRIPE_SECRET_KEY` not set
- OTP emails print to console in dev when `EMAIL_USER`/`EMAIL_PASS` not set

## Product

### Vendor
- Browse 53+ raw materials (oils, spices, grains, pulses, dairy, vegetables, dry fruits…)
- Cart with per-supplier delivery preferences + payment modal (COD / Card / UPI)
- Active orders, in-transit tracking, order history, ratings
- Saved items, marketplace, sell items, my listings

### Supplier
- Dashboard with clickable stats → Revenue page, Completed Orders page, Analytics page
- Analytics banner linking to `/supplier/analytics`
- Notifications page (`/supplier/notifications`) — real backend notifications with filter/clear
- Inventory management (add/edit/delete products)
- Pending orders (accept/reject/WhatsApp)
- Profile: Business Info, Images (upload + persist), Delivery Settings, Sales History (real data)
- Accepting Orders toggle — fixed to stay within bounds

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Vendor | `vendor@example.com` | `vendor123` |
| Vendor 2 | `vendor2@example.com` | `vendor123` |
| Supplier | `supplier@example.com` | `supplier123` |
| Supplier 2 | `supplier2@example.com` | `supplier123` |

## Gotchas

- Backend uses in-memory MongoDB — data resets on every backend restart
- Stripe works in mock mode without key (returns `mock_pi_*` IDs)
- HMR context invalidation warnings are harmless — full page reload resolves them
- `businessImages` field stored with an `id` field (not MongoDB `_id`) for frontend keying
