# Quick Start Guide - Village Registration Fix

## 🚀 Get Started in 3 Steps

### Step 1: Setup Database
```bash
cd backend
npm install
node seed-database.js
```

### Step 2: Start Backend
```bash
# In backend directory
npm start
```

### Step 3: Start Frontend
```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

## 🧪 Test the Fix

### Test 1: Verify Villages Load
1. Open http://localhost:5173
2. Click "Register here" (on Local User tab)
3. Check the "Select Your Village" dropdown
4. ✅ Should show 20 Vidarbha villages

### Test 2: Register New User
1. Fill in registration form:
   - Username: Your Name
   - Email: test@example.com
   - Password: test123
   - Village: Select any village (e.g., "Yavatmal")
   - Phone: (optional)
2. Click "Create Account"
3. ✅ Should show success message

### Test 3: Login and View Village Data
1. Login with your new credentials
2. Navigate to "My Village Data"
3. ✅ Should show data for your selected village only
4. Check the page header
5. ✅ Should display your village name

### Test 4: Submit Report
1. Navigate to "Report Shortage"
2. Fill in the form
3. Submit report
4. ✅ Report should be automatically linked to your village

## 🔍 Troubleshooting

### Villages Dropdown is Empty?

**Quick Fix:**
```bash
# Check if villages exist
cd backend
node test-villages.js

# If no villages found, seed the database
node seed-database.js
```

### Backend Not Starting?

**Check:**
1. PostgreSQL is running
2. `.env` file exists in backend folder
3. Database credentials are correct

**Create `.env` file:**
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
```

### Frontend Can't Connect to Backend?

**Check:**
1. Backend is running on port 5000
2. Frontend `.env` has correct API URL

**Create frontend `.env` file:**
```bash
cd frontend
cp .env.example .env
# Should contain: VITE_API_URL=http://localhost:5000/api
```

## 📝 Demo Credentials

### Admin Account
- Email: `admin@water.gov`
- Password: `admin123`
- Access: All villages, all features

### Local User Account
- Email: `localuser@water.gov`
- Password: `local123`
- Village: Yavatmal
- Access: Only Yavatmal village data

## 🎯 What's Fixed

1. ✅ Village dropdown loads 20 Vidarbha villages
2. ✅ Registration properly saves village selection
3. ✅ Users only see data for their village
4. ✅ Reports automatically use user's village
5. ✅ Alerts filtered by user's village
6. ✅ Tanker allocations filtered by user's village

## 📚 More Information

- **Detailed Fix Documentation**: See `VILLAGE_REGISTRATION_FIX.md`
- **All Changes**: See `CHANGES_SUMMARY.md`
- **API Testing**: Run `bash test-api-endpoints.sh`

## 🆘 Still Having Issues?

1. Check backend logs for errors
2. Check browser console for errors
3. Verify database connection: `node backend/test-connection.js`
4. Verify villages exist: `node backend/test-villages.js`
5. Test API directly: `curl http://localhost:5000/api/auth/villages`

## ✨ Next Steps

After successful registration and login:
1. Explore the dashboard
2. View your village's water data
3. Check alerts for your village
4. Track tanker allocations
5. Submit water shortage reports

Enjoy using JalRakshak AI! 💧
