# Exam Paper Repository (MERN Stack)

A web-based platform to upload, search, and manage exam papers with user authentication, role-based access, and real-time notifications.

---

## Features

- **User Authentication** (Google OAuth via backend)
- **Exam Paper Upload** with OCR (batch processed later)
- **Topic Classification** (batch processed later)
- **Advanced Search & Filters**
- **Role-based Access** (Admin / User)
- **Email + In-app Notifications**
- **Payment Subscription Support**
- **Cloud Storage Integration** (Cloudinary)
- **MongoDB Atlas Database**
- **Responsive Frontend** (React + Vite)
- **Single Backend** for simplicity

---

## Tech Stack

**Frontend:**
- React (Vite)
- React Router DOM
- Axios
- Socket.IO Client
- File Saver

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Google OAuth 2.0
- Cloudinary SDK
- Socket.IO
- CORS

**Hosting:**
- Backend: Render
- Frontend: Vercel

---

## ⚙️ Environment Variables

### **Backend**
Create `.env.development` (for local) and `.env.production` (for deployment):

.env
# General
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Auth & Security
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Database
MONGODB_URI=your_mongodb_uri

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

### **Frontend**
Create `.env.development` (for local) and `.env.production` (for deployment):

.env
VITE_API_URL=http://localhost:5000

---
## Local Development
1. Clone Repo
```
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```
2. Backend Setup
```
cd backend
npm install
npm run dev   # or npm start
```
3. Frontend Setup
```
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173
Backend runs on http://localhost:5000

## Deployment
Backend (Render)
Root Directory: backend
Build Command: 
```
npm install
```
Start Command: 
```
node server.js
```
Add .env.production values in Render dashboard

Frontend (Vercel)
Root Directory: frontend
Build Command: 
```
npm run build
```
Output Directory: dist

Add .env.production values in Vercel dashboard

## Notes
- OCR and topic classification are batch processed later.
- Notifications are email-based and in-app.
- Subscription/payment features are in scope for future updates.
- MongoDB Atlas is recommended for database hosting.

## Contributing
Pull requests are welcome!
For major changes, open an issue first to discuss what you’d like to change.
