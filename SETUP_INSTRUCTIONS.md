# 🚀 JalRakshak AI - Setup Instructions

## Current Status

✅ **Frontend**: Running on http://localhost:3000
❌ **Backend**: Waiting for MySQL database connection

## What's Working

- Frontend server is running successfully
- All dependencies are installed
- Configuration files are created

## What Needs Setup

### MySQL Database Setup Required

The backend needs MySQL to be installed and running. Here's how to set it up:

### Option 1: Install MySQL (Recommended)

1. **Download MySQL**
   - Visit: https://dev.mysql.com/downloads/installer/
   - Download MySQL Installer for Windows
   - Choose "mysql-installer-community"

2. **Install MySQL**
   - Run the installer
   - Choose "Developer Default" or "Server only"
   - Set root password: `my1301SQL#` (or update backend/.env)
   - Complete the installation

3. **Start MySQL Service**
   ```powershell
   net start MySQL80
   ```

4. **Create Database**
   ```powershell
   cd backend
   node create-db.js
   ```

5. **Seed Database**
   ```powershell
   node seed-database.js
   ```

6. **Restart Backend**
   - The backend will automatically connect once MySQL is running

### Option 2: Use Existing MySQL

If you already have MySQL installed:

1. **Update backend/.env** with your credentials:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=water_governance
   ```

2. **Create Database**
   ```powershell
   cd backend
   node create-db.js
   ```

3. **Seed Database**
   ```powershell
   node seed-database.js
   ```

### Option 3: Quick Test Without Database

To see the frontend UI without backend:

1. Open http://localhost:3000
2. You'll see the login page
3. Backend features won't work until MySQL is set up

## Current Running Services

### Frontend (Port 3000)
- **Status**: ✅ Running
- **URL**: http://localhost:3000
- **Access**: Open in your browser now!

### Backend (Port 5000)
- **Status**: ⏳ Waiting for MySQL
- **URL**: http://localhost:5000 (will work after MySQL setup)

## Next Steps

### Immediate (See the UI)
1. Open http://localhost:3000 in your browser
2. Explore the frontend interface
3. See the beautiful JalRakshak AI design

### To Get Full Functionality
1. Install MySQL (see Option 1 above)
2. Create and seed the database
3. Backend will automatically connect
4. Full system will be operational

## Quick Commands

### Check MySQL Service
```powershell
Get-Service -Name "*mysql*"
```

### Start MySQL Service
```powershell
net start MySQL80
```

### Test Database Connection
```powershell
cd backend
node test-connection.js
```

### Check Villages in Database
```powershell
cd backend
node test-villages.js
```

## Troubleshooting

### Frontend Not Loading?
- Check if port 3000 is available
- Look for errors in the terminal
- Try: http://localhost:3000

### Backend Connection Error?
- MySQL service must be running
- Check credentials in backend/.env
- Verify MySQL is installed

### Port Already in Use?
- Frontend: Change port in vite.config.js
- Backend: Change PORT in backend/.env

## What You Can Do Now

### Without Database (Frontend Only)
- ✅ View the login page
- ✅ See the UI design
- ✅ Explore the interface
- ❌ Cannot login (needs backend)
- ❌ Cannot register (needs backend)

### With Database (Full System)
- ✅ Register new users
- ✅ Login with credentials
- ✅ View village data
- ✅ Submit reports
- ✅ Track tankers
- ✅ View alerts
- ✅ Full functionality

## Demo Credentials (After Database Setup)

### Admin
```
Email: admin@water.gov
Password: admin123
```

### Local User
```
Email: localuser@water.gov
Password: local123
Village: Yavatmal
```

## Files Created

- ✅ backend/.env (Database configuration)
- ✅ frontend/.env (API configuration)
- ✅ backend/node_modules (Dependencies installed)
- ✅ frontend/node_modules (Dependencies installed)

## Architecture

```
Frontend (React + Vite)
    ↓ Port 3000
    ↓ API Calls
Backend (Express + Node.js)
    ↓ Port 5000
    ↓ Database Queries
MySQL Database
    ↓ Port 3306
    ↓ Data Storage
```

## Support

- **Documentation**: See START_HERE.md
- **Quick Start**: See QUICK_START.md
- **Testing**: See TESTING_CHECKLIST.md
- **Architecture**: See ARCHITECTURE_FLOW.md

## Current Terminal Sessions

1. **Backend Terminal**: Running `npm start` (waiting for MySQL)
2. **Frontend Terminal**: Running `npm run dev` (active on port 3000)

## Ready to Go!

🎉 **Frontend is ready!** Open http://localhost:3000 now!

⏳ **Backend needs MySQL** - Follow Option 1 above to complete setup

---

**Project**: JalRakshak AI - Water Governance System
**Status**: Frontend Running, Backend Waiting for Database
**Next**: Install MySQL and seed database for full functionality
