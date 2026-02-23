# Village Registration & Data Filtering Fix

## Issues Fixed

1. **Village Dropdown Not Showing**: Added better error handling and logging for village loading
2. **Reports Route Missing**: Added the missing `/api/reports` route to server.js
3. **Village-Specific Data Filtering**: Verified all endpoints properly filter data by user's village_id

## Changes Made

### Backend Changes

1. **server.js**
   - Added missing `reportRoutes` import
   - Added `/api/reports` route registration

2. **Better Error Handling**
   - Villages endpoint already exists at `/auth/villages` (public, no auth required)
   - All village-specific endpoints use `req.user.village_id` from JWT token

### Frontend Changes

1. **Login.jsx**
   - Improved village loading with better error handling
   - Added error message if villages fail to load
   - Villages are fetched on component mount

## How Village Data Filtering Works

### Registration Flow
1. User selects a village during registration
2. `village_id` is stored in the User record
3. Upon login, `village_id` is included in the JWT token

### Data Access Flow
1. User makes authenticated request
2. JWT token is decoded by `authenticate` middleware
3. `req.user.village_id` is available in all routes
4. Endpoints filter data by this village_id:
   - `/api/alerts/my-village` - Only alerts for user's village
   - `/api/tankers/my-village` - Only tanker allocations for user's village
   - `/api/reports/my-reports` - Only reports submitted by the user
   - `/api/data/rainfall/:villageId` - Rainfall data for specific village
   - `/api/data/groundwater/:villageId` - Groundwater data for specific village

## Testing Instructions

### 1. Verify Database Has Villages

```bash
# Test if villages exist in database
node backend/test-villages.js
```

If no villages found, seed the database:

```bash
node backend/seed-database.js
```

### 2. Test Villages Endpoint

```bash
# Start the backend server
cd backend
npm start
```

In another terminal:

```bash
# Test the public villages endpoint (no auth required)
curl http://localhost:5000/api/auth/villages
```

Expected response: JSON array of villages with id, name, and district

### 3. Test Registration Flow

1. Open the frontend: `http://localhost:5173`
2. Click "Register here" link (visible when on Local User tab)
3. Verify the "Select Your Village" dropdown shows villages
4. Fill in the form and register
5. After successful registration, login with the new account
6. Verify you see data specific to your selected village

### 4. Verify Village-Specific Data

After logging in as a local user:

1. **Dashboard** - Should show your village name and data
2. **My Village Data** - Should show rainfall/groundwater for your village only
3. **My Alerts** - Should show alerts for your village only
4. **Track Tankers** - Should show tanker allocations for your village only
5. **Report Shortage** - Should automatically use your village_id

## Troubleshooting

### Villages Dropdown is Empty

**Check 1: Backend is running**
```bash
curl http://localhost:5000/api/health
```

**Check 2: Villages exist in database**
```bash
node backend/test-villages.js
```

**Check 3: CORS is configured**
- Verify backend has `cors()` middleware enabled
- Check browser console for CORS errors

**Check 4: Frontend API URL**
- Check `frontend/.env` has correct `VITE_API_URL`
- Default: `http://localhost:5000/api`

### User Can't See Village Data After Login

**Check 1: User has village_id**
- Login and check the user object in localStorage
- Should have `village_id` and `village` object

**Check 2: JWT token includes village_id**
- Backend login route includes `village_id` in token payload
- Check `/api/auth/me` endpoint response

**Check 3: Endpoints are authenticated**
- All village-specific endpoints require authentication
- Token must be sent in `Authorization: Bearer <token>` header

## API Endpoints Reference

### Public Endpoints (No Auth)
- `GET /api/auth/villages` - Get all villages for registration dropdown
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Local User Endpoints (Auth Required)
- `GET /api/alerts/my-village` - Get alerts for user's village
- `GET /api/tankers/my-village` - Get tanker allocations for user's village
- `GET /api/reports/my-reports` - Get user's submitted reports
- `POST /api/reports/water-shortage` - Submit water shortage report
- `GET /api/data/rainfall/:villageId` - Get rainfall data
- `GET /api/data/groundwater/:villageId` - Get groundwater data
- `GET /api/analysis/wsi/:villageId` - Get Water Stress Index
- `GET /api/analysis/drought/:villageId` - Get drought analysis

### Admin Endpoints (Admin Role Required)
- `GET /api/villages` - Get all villages
- `POST /api/villages` - Create village
- `PUT /api/villages/:id` - Update village
- `DELETE /api/villages/:id` - Delete village
- `GET /api/reports/all` - Get all reports
- `PUT /api/reports/:id/status` - Update report status

## Demo Credentials

### Admin
- Email: `admin@water.gov`
- Password: `admin123`

### Local User (Yavatmal Village)
- Email: `localuser@water.gov`
- Password: `local123`

## Next Steps

After registration, local users will:
1. See their village name in the dashboard header
2. Access only data relevant to their village
3. Submit reports that are automatically linked to their village
4. Receive alerts specific to their village's water situation
