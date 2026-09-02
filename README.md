# SIMS — Stock Inventory Management System

A full-stack inventory management platform for tracking spare parts stock, suppliers, and store keeper activity in real time — built to replace manual, notebook-based stock tracking with a secure, auditable digital system.

**Live demo:** _add your deployed URL here_

---

## Overview

SIMS gives an **owner** full oversight of inventory operations while **store keepers** handle day-to-day stock movement. Every stock-in, stock-out, and adjustment is logged, valued in Rwandan Francs (RWF), and rolled up into dashboards and reports the owner can act on.

**Core capabilities**

- Real-time spare parts inventory with low-stock alerts
- Stock In / Stock Out / Stock Adjustments, each generating an audit trail
- Category and supplier management
- Two-role access model: **Owner** (administration) and **Store Keeper** (operations)
- Session-based authentication with hashed passwords
- Dashboard analytics and exportable reports
- Light/dark theme, fully responsive UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (Vite), Tailwind CSS, Framer Motion, React Router, Recharts |
| Backend | Node.js, Express 5 |
| Database | MongoDB (MongoDB Atlas) via Mongoose |
| Auth | express-session + connect-mongo (session store), bcryptjs (password hashing) |
| Reporting | jsPDF / jsPDF-AutoTable (client-side PDF export) |

---

## Project Structure

```
SIMS/
├── SERVER/                # Backend — Node.js + Express
│   ├── auth/               # Login, session middleware
│   ├── models/             # Mongoose schemas
│   ├── utils/              # Activity logger, password generator
│   ├── categories.js       # Category routes
│   ├── suppliers.js        # Supplier routes
│   ├── spares.js           # Spare parts routes
│   ├── stock_in.js         # Stock-in routes
│   ├── stock_out.js        # Stock-out routes
│   ├── adjustments.js      # Stock adjustment routes
│   ├── storekeepers.js     # Store keeper management (owner-only)
│   ├── analytics.js        # Dashboard analytics
│   ├── reports.js          # Reporting endpoint
│   ├── db.js               # MongoDB connection
│   ├── seed.js              # One-time owner account seeding
│   └── server.js            # App entry point
│
├── UI/                    # Frontend — React + Vite
│   └── src/
│       ├── api/            # Axios instance
│       ├── components/     # Layout, shared UI components
│       ├── context/        # Theme context
│       ├── pages/          # Route-level pages
│       ├── routes/         # Route guards
│       └── utils/          # Helpers
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or a local MongoDB instance)

### 1. Clone the repository

```bash
git clone https://github.com/jstackv/stock-inventory-management-system.git
cd stock-inventory-management-system/SIMS
```

### 2. Backend setup

```bash
cd SERVER
npm install
cp .env.example .env   # then fill in the real values, see below
```

`.env` variables:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas (or local) connection string |
| `SESSION_SECRET` | Long random string used to sign session cookies |
| `PORT` | Port the API listens on (default `8000`) |
| `CLIENT_ORIGIN` | Frontend URL allowed by CORS, e.g. `http://localhost:3000` |
| `OWNER_FULLNAMES` / `OWNER_EMAIL` / `OWNER_PHONE` / `OWNER_PASSWORD` | Used once by `npm run seed` to create the single owner account |

SIMS supports exactly one owner account, created via the seed script rather than public registration:

```bash
npm run seed
```

Start the API in dev mode:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd UI
npm install
cp .env.example .env   # set VITE_API_URL to your backend URL
npm run dev
```

The app runs at `http://localhost:3000` by default and expects the API at the URL in `VITE_API_URL` (defaults to `http://localhost:8000`).

---

## API Reference

All endpoints except `/login` require an active session (`requireAuth` middleware).

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/login` | Log in |
| POST | `/logout` | Log out |
| GET | `/dashboard` | Get the logged-in user |
| PUT | `/change-password` | Change the current user's password |

### Store Keepers (owner only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/storekeepers` | List store keepers |
| GET | `/storekeepers/overview` | Store keeper summary stats |
| POST | `/storekeepers` | Create a store keeper |
| PUT | `/storekeepers/:id` | Update a store keeper |
| PATCH | `/storekeepers/:id/status` | Activate/deactivate a store keeper |
| POST | `/storekeepers/:id/reset-password` | Reset a store keeper's password |
| DELETE | `/storekeepers/:id` | Remove a store keeper |

### Spares

| Method | Endpoint | Description |
|---|---|---|
| GET | `/spares` | List spares (paginated/filterable) |
| GET | `/spares/all` | List all spares, unpaginated |
| POST | `/spares` | Create a spare |
| PUT | `/spares/:id` | Update a spare |
| DELETE | `/spares/:id` | Delete a spare |

### Stock movement

| Method | Endpoint | Description |
|---|---|---|
| GET / POST | `/stockin` | View / record stock-in |
| GET / POST | `/stockout` | View / record stock-out |
| GET / POST | `/adjustments` | View / record stock adjustments |

### Catalog & reporting

| Method | Endpoint | Description |
|---|---|---|
| GET / POST / PUT / DELETE | `/categories` , `/categories/:id` | Manage categories |
| GET / POST / PUT / DELETE | `/suppliers` , `/suppliers/:id` | Manage suppliers |
| GET | `/analytics` | Dashboard analytics |
| GET | `/reports` | Reporting data |

---

## Security

- Passwords hashed with bcrypt, never stored or returned in plain text
- Session-based authentication with sessions persisted in MongoDB (`connect-mongo`), not in memory
- Cookies are `secure` + `sameSite=none` in production (cross-domain, HTTPS-only) and `lax` in local dev
- Owner-only routes are gated server-side, not just hidden in the UI
- Server-side input validation on write endpoints

---

## Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for the full step-by-step guide to deploying the backend to Vercel (as a serverless function) and the frontend to Netlify.

---

## Roadmap

- Role-based permission granularity beyond owner/store keeper
- Notification system for low-stock and pending adjustments
- Mobile app companion

---

## License

This project is provided for educational and portfolio purposes.