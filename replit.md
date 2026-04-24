# JugaduBazar — MERN Stack

A full-stack MERN marketplace connecting Indian street-food vendors with raw-material suppliers.

## Tech Stack

- **MongoDB** — data store (in-memory mongodb-memory-server in dev, MongoDB Atlas in prod)
- **Express** — REST API
- **React 18 + Vite + Tailwind** — SPA frontend
- **Node 20** — runtime
- All source code is JavaScript / JSX (no TypeScript)

## Project Structure

```
backend/
├── server.js                # Express app entry
├── config/db.js             # Mongo connection (auto in-memory if no URI)
├── middleware/
│   ├── auth.js              # JWT auth + role guards
│   └── errorHandler.js
├── models/
│   ├── User.js              # vendor / supplier accounts
│   ├── Material.js          # supplier-listed products
│   ├── Order.js             # orders with status history & ratings
│   ├── Notification.js
│   ├── SavedItem.js         # vendor favorites
│   └── CartItem.js          # persistent cart
├── routes/
│   ├── auth.js              # register, login, /me, profile, email verify
│   ├── materials.js         # CRUD + search/filter/pagination
│   ├── orders.js            # create, list, status, cancel, rate
│   ├── notifications.js
│   ├── saved.js
│   ├── cart.js
│   └── users.js             # public supplier directory
├── utils/seed.js            # demo data seed
├── package.json
└── .env.example

client/
├── App.jsx                  # SPA routing
├── main.jsx
├── pages/                   # ~27 page components
├── components/ui/           # Radix-based component library
├── contexts/                # Auth, Cart, Notification, Language
├── hooks/, lib/             # api.js calls /api/* (proxied to backend)
└── global.css

vite.config.js               # Dev server on :5000, proxies /api → :3001
```

## Workflows

- **Start application** — Vite dev server on `:5000` (the user-facing preview)
- **Backend** — Express + Mongo on `:3001`

The Vite dev server proxies `/api/*` requests to the backend, so the frontend can call `fetch("/api/...")` and everything just works.

## API Surface

All routes are prefixed with `/api`. JWT bearer tokens (returned by login/register) are required for protected routes.

### Auth (`/api/auth`)
- `POST /register`
- `POST /login`
- `GET  /me`
- `PUT  /profile`
- `POST /verify-email`
- `POST /resend-verification`
- `POST /logout`

### Materials (`/api/materials`)
- `GET    /`                         — list with search/category/price/stock filters + pagination
- `GET    /:id`                      — single item with supplier info
- `GET    /supplier/:supplierId`     — items for one supplier
- `POST   /`                         — supplier only
- `PUT    /:id`                      — supplier only (own items)
- `DELETE /:id`                      — supplier only (own items)

### Orders (`/api/orders`)
- `GET /`                            — vendor sees their orders, supplier sees incoming
- `GET /:id`
- `POST /`                           — vendor only; auto-decrements stock, notifies supplier
- `PUT /:id/status`                  — supplier only; logs to status history, notifies vendor
- `PUT /:id/cancel`                  — either party; restores stock, notifies the other
- `PUT /:id/rate`                    — vendor only after delivery; updates supplier & material aggregates

### Notifications (`/api/notifications`)
- `GET /`, `PUT /:id/read`, `PUT /read-all`, `DELETE /:id`, `DELETE /clear`

### Saved Items (`/api/saved`)
- `GET /`, `POST /:materialId`, `DELETE /:materialId`

### Cart (`/api/cart`)
- `GET /`, `POST /`, `PUT /:materialId`, `DELETE /:materialId`, `DELETE /`

### Users (`/api/users`)
- `GET /suppliers`                   — public supplier directory
- `GET /:id`

### Health
- `GET /api/ping`, `GET /api/health`

## Demo Credentials

The backend auto-seeds these on first start:

| Role     | Email                     | Password    |
|----------|---------------------------|-------------|
| Vendor   | `vendor@example.com`      | `vendor123` |
| Supplier | `supplier@example.com`    | `supplier123` |

…plus 6 demo materials (oils, spices, grains, pulses).

## Configuration (`backend/.env`)

```
PORT=3001
MONGODB_URI=                # leave blank → uses in-memory MongoDB
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
SEED_ON_START=true
```

For production, point `MONGODB_URI` at a real MongoDB cluster (Atlas, etc.) — nothing else needs to change.

## Scripts

Frontend (root):
- `npm run dev` — Vite dev server on :5000
- `npm run build` — production build to `dist/`

Backend (`backend/`):
- `npm start` — production server
- `npm run dev` — `node --watch` (auto-restart on file changes)
- `npm run seed` — re-run the seed script
