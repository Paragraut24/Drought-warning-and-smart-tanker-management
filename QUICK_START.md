# ⚡ Quick Start (5 Minutes)

## Prerequisites
- ✅ Node.js installed
- ✅ MySQL installed and running

## 1️⃣ Database Setup (1 minute)

Open MySQL and run:
```sql
CREATE DATABASE water_governance;
```

## 2️⃣ Backend Setup (2 minutes)

```cmd
cd backend
npm install
copy .env.example .env
```

Edit `backend/.env` - Change only this line:
```
DB_PASSWORD=YOUR_MYSQL_PASSWORD
```

Start backend:
```cmd
npm start
```

## 3️⃣ Frontend Setup (2 minutes)

Open NEW terminal:
```cmd
cd frontend
npm install
copy .env.example .env
npm run dev
```

## 4️⃣ Access Application

1. Open browser: http://localhost:3000

2. Register first user (use Postman or curl):
```
POST http://localhost:5000/api/auth/register
Body: {
  "username": "admin",
  "email": "admin@water.gov",
  "password": "admin123",
  "role": "admin"
}
```

3. Login with:
   - Email: admin@water.gov
   - Password: admin123

## 🎉 Done!

Now you can:
- Add villages via Data Upload page
- Upload rainfall/groundwater data
- View WSI calculations
- Allocate tankers
- Optimize routes

## Alternative: One-Click Start

Double-click `START.bat` file to start both servers automatically!

---

For detailed setup, see SETUP_GUIDE.md
