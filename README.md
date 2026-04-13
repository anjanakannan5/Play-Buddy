# 🎈 PlayBuddy – Safe Play. Smart Learning. Happy Kids.

A full-stack family platform built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd playbuddy-backend
npm install
cp .env.example .env
# Edit .env and fill in your values (especially ANTHROPIC_API_KEY)
npm run dev
```

The backend will start on **http://localhost:5000**

### 2. Frontend Setup

```bash
cd playbuddy-frontend
npm install
npm run dev
```

The frontend will start on **http://localhost:5173**

---

## 🔧 Environment Variables (`.env` in backend)

| Variable | Description |
|---|---|
| `PORT` | Backend port (default: 5000) |
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (for AI chat) |
| `CLIENT_URL` | Frontend URL (default: http://localhost:5173) |
| `NODE_ENV` | `development` or `production` |

---

## ✅ Bug Fixes Applied

### 1. 🔐 User Login Now Shows Real User Data
**Problem:** After login/signup, the dashboard showed hardcoded "Sarah Johnson" instead of the actual user.

**Fix:**
- `AuthContext.jsx` stores the JWT token in `localStorage` after login/signup
- On app load, it calls `GET /api/auth/me` with the token to fetch the real user from MongoDB
- All UI components (Sidebar, Dashboard, DashNav) read from `AuthContext` — never hardcoded

### 2. 🧠 Learning Feature Now Works with Real Quizzes
**Problem:** Clicking a learning activity only showed an alert/toast — no actual lesson.

**Fix:**
- Backend `GET /api/learning/:type` serves 5 real questions per subject (vocab, math, story, science)
- Frontend renders a full quiz modal with multiple-choice options, instant feedback (green/red), and progress bar
- `POST /api/learning/:type/submit` saves scores to MongoDB
- Results screen shows score percentage and allows retrying

### 3. 📅 Events Can Now Be Created
**Problem:** The "+ Create Event" button had no functionality — no form existed.

**Fix:**
- Added a full modal form with: title, description, type, date, time, location, age range, price
- `POST /api/events` saves the event to MongoDB with the creator's user ID
- Events list is fetched from the backend; falls back to demo events if none exist
- RSVP toggle works for both real and demo events

---

## 📁 Project Structure

```
playbuddy/
├── playbuddy-frontend/          # React + Vite
│   └── src/
│       ├── context/             # AuthContext, ThemeContext, ToastContext
│       ├── layouts/             # DashboardLayout, MainLayout
│       ├── components/          # Sidebar, Navbar, DarkToggle, etc.
│       └── pages/               # Landing, Auth, Dashboard, Events, Learning, etc.
│
└── playbuddy-backend/           # Node.js + Express
    └── src/
        ├── models/              # User, Child, Event, Learning, Message, Voice
        ├── routes/              # auth, children, events, learning, messages, ai, voice
        ├── middleware/          # JWT auth middleware
        └── utils/               # JWT helpers
```

---

## 🤖 AI Chat
The AI chat uses Claude via the Anthropic API. Set your `ANTHROPIC_API_KEY` in `.env`.
If no key is set, it falls back to friendly pre-written responses so the app still works.

---

Made with 💜 for families everywhere.
