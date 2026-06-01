# Exam Paper Repository (MERN Stack)

A web-based platform to upload, search, and manage exam papers with user authentication, role-based access, and in-app notifications.

---

## ✅ Bug Fixes Applied

The following issues were identified and fixed:

### Backend
1. **User model** — Added missing `fullName`, `isAdmin`, `credits`, `googleId` fields (was only `name` + `email`)
2. **Auth — `/api/auth/me` missing** — Added GET endpoint so frontend can re-authenticate on page load
3. **OAuth callback URL** — Now redirects to `/auth/success?token=<jwt>` on frontend (was redirecting to non-existent `/auth/success` with no token)
4. **Email domain restriction** — Made configurable via `ALLOWED_EMAIL_DOMAIN` env var (was hardcoded `@college.edu`)
5. **Queue / Redis** — Graceful degradation: uploads still work if Redis is unavailable; OCR just skips
6. **Admin users route missing** — Added `GET /api/admin/users` and `POST /api/admin/users/:id/credits`
7. **Notifications routes missing** — Added `GET /api/notifications` and `POST /api/notifications/:id/read`
8. **Paper `/:id` route missing** — Added `GET /api/papers/:id` and `GET /api/papers/:id/download`
9. **`academicYear` vs `year` field** — Backend accepts both; frontend now sends the right field
10. **CORS** — Fixed to allow both `FRONTEND_URL` env var and localhost in dev
11. **dotenv** — Fixed to load env BEFORE importing modules that depend on env vars
12. **Error handling** — Added global error handler and try/catch to all controllers

### Frontend
13. **Landing page infinite loop** — Was navigating to `/` which re-renders Landing; replaced with a real landing page
14. **`/dashboard` route missing** — Added to `App.jsx`
15. **`/auth/success` route missing** — Created `AuthSuccess` page to handle OAuth token from URL param
16. **Duplicate `/` route** — Fixed; Landing and Dashboard are now separate routes
17. **Login hardcoded `localhost:5000`** — Now uses `VITE_API_URL` env var via context
18. **`user.name` vs `user.fullName`** — Fixed everywhere to use `fullName`
19. **`user.role === "admin"` vs `user.isAdmin`** — Fixed to use `isAdmin` boolean (matches model)
20. **Search API endpoint** — Frontend was calling `/api/papers/search`; correct route is `/api/search`
21. **Search response shape** — API returns `{ results, total }`; frontend now reads that correctly
22. **AuthContext socket.io** — Removed socket.io client (backend never initialized it); simplifies auth flow
23. **AuthContext loading state** — Added `loading` flag to prevent flash of login redirect

---

## Features

- **User Authentication** via Google OAuth 2.0
- **Exam Paper Upload** (PDF/images) with Cloudinary storage
- **Duplicate detection** via MD5 hash
- **Admin review** — approve/reject papers
- **Credits system** — users earn credits on paper approval
- **Advanced Search** by course code, semester, year, or question keywords
- **In-app Notifications** — notified when paper is approved/rejected
- **Background OCR** via Tesseract.js + BullMQ (optional, requires Redis)
- **Role-based access** (Admin / User)

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express 5 |
| Database | MongoDB + Mongoose |
| Auth | Google OAuth 2.0 + JWT |
| Storage | Cloudinary |
| Queue | BullMQ + Redis (optional) |
| OCR | Tesseract.js (background worker) |
| Hosting | Render (backend) + Vercel (frontend) |

---

## ⚙️ Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.development .env  # fill in your values
npm run dev               # runs on http://localhost:5000
```

**Required environment variables** (see `.env.development`):
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — random string for JWT signing
- `SESSION_SECRET` — random string for express-session
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — from [Google Cloud Console](https://console.cloud.google.com)
- `GOOGLE_CALLBACK_URL` — `http://localhost:5000/api/auth/google/callback` (dev)
- `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET` — from [Cloudinary](https://cloudinary.com)
- `FRONTEND_URL` — `http://localhost:5173` (dev)

**Optional:**
- `ALLOWED_EMAIL_DOMAIN` — restrict signups (e.g. `college.edu`); leave empty to allow all
- `REDIS_URL` — enables background OCR; app works without it

### 2. Frontend

```bash
cd frontend
npm install
# create .env.development with:
# VITE_API_URL=http://localhost:5000
npm run dev               # runs on http://localhost:5173
```

### 3. Google OAuth setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
4. Copy client ID and secret to your `.env`

### 4. Make yourself admin

After your first login, open MongoDB Atlas (or Compass) and update your user:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { isAdmin: true } })
```

---

## Deployment

### Backend (Render)
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Set all env vars in Render dashboard
- Update `GOOGLE_CALLBACK_URL` to `https://your-backend.onrender.com/api/auth/google/callback`
- Add that URL to Google Cloud Console → Authorized redirect URIs

### Frontend (Vercel)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Set `VITE_API_URL=https://your-backend.onrender.com` in Vercel dashboard

---

## Optional: OCR Worker

The OCR worker extracts questions from uploaded papers in the background. Requires Redis.

```bash
cd backend
REDIS_URL=redis://localhost:6379 npm run worker
```

Without the worker, papers are uploaded and stored but questions aren't extracted (search by keywords won't find them). Everything else works normally.
