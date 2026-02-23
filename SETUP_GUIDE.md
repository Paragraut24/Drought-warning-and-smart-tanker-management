# 🚀 Quick Start Guide - Water Governance Platform

## Prerequisites Installation

### 1. Install Node.js
- Download from: https://nodejs.org/
- Recommended: v18 or higher
- Verify installation:
```cmd
node --version
npm --version
```

### 2. Install MySQL
- Download from: https://dev.mysql.com/downloads/mysql/
- During installation, set root password
- Verify installation:
```cmd
mysql --version
```

## Step-by-Step Setup

### STEP 1: Database Setup

1. Open MySQL Command Line or MySQL Workbench

2. Create database:
```sql
CREATE DATABASE water_governance;
```

3. Verify database created:
```sql
SHOW DATABASES;
```

### STEP 2: Backend Setup

1. Open Command Prompt in project root

2. Navigate to backend:
```cmd
cd backend
```

3. Install dependencies:
```cmd
npm install
```

4. Create environment file:
```cmd
copy .env.example .env
```

5. Edit `.env` file with your settings:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=water_governance
JWT_SECRET=my_super_secret_key_12345

WSI_RAINFALL_WEIGHT=0.35
WSI_GROUNDWATER_WEIGHT=0.30
WSI_POPULATION_WEIGHT=0.20
WSI_STORAGE_WEIGHT=0.15

DAILY_WATER_PER_CAPITA=55
HIGH_WSI_THRESHOLD=70
HIGH_WSI_ADJUSTMENT=1.20
```

6. Start backend server:
```cmd
npm start
```

✅ Backend should now be running on http://localhost:5000

### STEP 3: Frontend Setup

1. Open NEW Command Prompt window

2. Navigate to frontend:
```cmd
cd frontend
```

3. Install dependencies:
```cmd
npm install
```

4. Create environment file:
```cmd
copy .env.example .env
```

5. Edit `.env` file:
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=
```

Note: Google Maps API key is optional for initial testing

6. Start frontend server:
```cmd
npm run dev
```

✅ Frontend should now be running on http://localhost:3000

### STEP 4: First Time Access

1. Open browser and go to: http://localhost:3000

2. You'll see the login page

3. First, create an admin user using API:

Open a NEW Command Prompt and run:
```cmd
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"email\":\"admin@water.gov\",\"password\":\"admin123\",\"role\":\"admin\"}"
```

Or use Postman/Thunder Client:
- URL: POST http://localhost:5000/api/auth/register
- Body (JSON):
```json
{
  "username": "admin",
  "email": "admin@water.gov",
  "password": "admin123",
  "role": "admin"
}
```

4. Login with:
- Email: admin@water.gov
- Password: admin123

## Testing the Platform

### Add Sample Village

POST http://localhost:5000/api/villages
Headers: Authorization: Bearer YOUR_TOKEN
Body:
```json
{
  "name": "Dharavi",
  "district": "Mumbai",
  "state": "Maharashtra",
  "population": 15000,
  "latitude": 19.0433,
  "longitude": 72.8564,
  "storage_capacity": 500000,
  "current_storage": 300000
}
```

### Add Rainfall Data

POST http://localhost:5000/api/data/rainfall
Body:
```json
{
  "village_id": 1,
  "record_date": "2024-01-15",
  "rainfall_mm": 45.5,
  "is_historical": false
}
```

### Add Groundwater Data

POST http://localhost:5000/api/data/groundwater
Body:
```json
{
  "village_id": 1,
  "measurement_date": "2024-01-15",
  "water_level": 12.5
}
```

### Check WSI

GET http://localhost:5000/api/analysis/wsi/1

## Common Issues & Solutions

### Issue 1: "Cannot connect to MySQL"
**Solution:**
- Check MySQL service is running
- Verify DB_PASSWORD in backend/.env
- Ensure database 'water_governance' exists

### Issue 2: "Port 5000 already in use"
**Solution:**
- Change PORT in backend/.env to 5001
- Update VITE_API_URL in frontend/.env to http://localhost:5001/api

### Issue 3: "npm install fails"
**Solution:**
- Delete node_modules folder
- Delete package-lock.json
- Run: npm cache clean --force
- Run: npm install again

### Issue 4: Frontend shows "Network Error"
**Solution:**
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend/.env
- Check browser console for CORS errors

## Project Structure

```
preventive-water-governance/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Auth & error handling
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── App.jsx      # Main app
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   └── package.json
└── README.md
```

## Development Workflow

1. **Backend changes**: Server auto-restarts with nodemon
2. **Frontend changes**: Hot reload automatically
3. **Database changes**: Modify models, restart backend
4. **API testing**: Use Postman or Thunder Client

## Production Build

### Backend
```cmd
cd backend
npm start
```

### Frontend
```cmd
cd frontend
npm run build
```
Build output in `frontend/dist/`

## Next Steps

1. ✅ Add more villages via Data Upload page
2. ✅ Upload rainfall and groundwater data
3. ✅ View WSI calculations on Dashboard
4. ✅ Create tankers and run allocation
5. ✅ Test route optimization
6. ✅ Monitor alerts

## Support

For issues, check:
- Backend logs in terminal
- Frontend console (F12 in browser)
- MySQL error logs
- Network tab for API errors

Happy coding! 💧
