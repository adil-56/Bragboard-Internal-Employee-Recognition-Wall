<<<<<<< HEAD
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
=======
# BragBoard: Internal Employee Recognition Wall

## Project Overview

**BragBoard** is an internal employee recognition platform designed to foster a culture of appreciation, motivation, and transparency within organizations. It provides a centralized digital space where employees and managers can publicly recognize and celebrate contributions, achievements, and positive behaviors.

In many organizations, appreciation is often informal, private, or short-lived. BragBoard solves this by making recognition **visible, structured, and persistent**, helping organizations reinforce positive culture, improve morale, and increase employee engagement.

This project was built as a **real-world full-stack application** with a clean separation of frontend, backend, and database layers, closely mirroring production-grade enterprise systems.

---

## Features

- 🏆 **Employee Recognition Wall**
  - Post appreciation messages for colleagues
  - Display recognitions in a centralized feed

- 🖥️ **Modern Frontend UI**
  - Clean, responsive React-based interface
  - Real-time updates from backend APIs

- ⚙️ **Robust Backend APIs**
  - RESTful APIs built with FastAPI
  - Structured request/response handling

- 🗄️ **Database Logging**
  - All recognitions stored securely in SQL
  - Timestamped and queryable records

- 🧪 **API Testing & Documentation**
  - Swagger UI for API documentation
  - Postman collections for manual testing

- 🔌 **Extensible Architecture**
  - Designed for easy addition of authentication, analytics, and notifications

---

## Project Structure
<img width="296" height="724" alt="image" src="https://github.com/user-attachments/assets/abf8928a-8338-4dd4-8619-aa7dce536658" />







---

## Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL
- Git

---

### Backend Setup (FastAPI)

```bash
cd backend_py
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt



Create a .env file:

DATABASE_URL=postgresql://user:password@localhost:5432/bragboard


Run the backend server:

uvicorn app.main:app --reload


Backend will be available at:

http://localhost:8000


Swagger API docs:

http://localhost:8000/docs

Frontend Setup (React)
cd frontend
npm install


Create a .env file:

VITE_API_BASE_URL=http://localhost:8000


Run the frontend:

npm run dev


Frontend will be available at:

http://localhost:5173

Usage

Start the backend server using FastAPI.

Start the frontend development server using React.

Open the frontend URL in your browser.

Post and view employee recognitions on the BragBoard wall.

Use Swagger UI or Postman to test backend APIs directly.


_Tech Stack_

**Backend**
FastAPI
Python
PostgreSQL
SQLAlchemy
Uvicorn


**Frontend**
React
Vite
JavaScript
HTML5 / CSS3
Tools & Utilities
Swagger (OpenAPI)
Postman
Git & GitHub
dotenv

Future Enhancements

🔐 User Authentication & Role-Based Access
🎖️ Badges and Gamification
📊 Analytics Dashboard (Top Contributors, Trends)
🔔 Notifications (Email / In-app)
📱 Mobile-Friendly UI Enhancements



Contributing
Contributions are welcome and encouraged.
Fork the repository
Create a new branch
git checkout -b feature/your-feature-name


Commit your changes
git commit -m "Add: your feature description"


Push to your branch
git push origin feature/your-feature-name


Open a Pull Request

License

This project is licensed under the MIT License.
You are free to use, modify, and distribute this project with proper attribution.

See the LICENSE
 file for details.

Author

Adil Khan
Final-semester MCA Student
Founder – TaskSaathi
Passionate about building real-world, system-driven software solutions with a focus on scalability, clarity, and impact.
>>>>>>> 087076360a173a404063f4bbe5824822c9c66e53
