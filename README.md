# 🏆 Bragboard — Employee Recognition Platform

A full-stack peer recognition platform where employees can send shoutouts, earn points, and redeem rewards. Built with React, FastAPI, and PostgreSQL.

<!-- 🔗 **[Live Demo](https://bragboard.vercel.app)** — Use the demo credentials shown on the login page -->

## Features

- 🔐 **JWT Authentication** — Secure registration and login with role-based access
- 📢 **Peer Recognition** — Send shoutouts with customizable point awards
- 💬 **Social Feed** — React (6 emoji types), comment, and boost colleague shoutouts
- 🎁 **Reward Catalog** — Redeem earned points for company rewards
- 📊 **Admin Analytics** — Overview KPIs, leaderboards, charts (area, bar, pie), CSV exports
- 👥 **User Management** — Promote/demote roles, reset points, content moderation
- 🛒 **Order Fulfillment** — Track reward redemption status (pending → shipped → fulfilled)
- ⏰ **Background Jobs** — Automated monthly points allocation via APScheduler

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TailwindCSS, Framer Motion, Recharts |
| Backend | FastAPI, SQLAlchemy, PostgreSQL |
| Auth | JWT (python-jose), bcrypt |
| Hosting | Vercel (frontend) + Render (backend + DB) |

## Getting Started

### Backend
```bash
cd backend_py
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python seed.py               # Create demo data
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bragboard.com | Bragboard@123 |
| Employee | adil.sharma1@bragboard.com | Bragboard@123 |

## License

MIT
