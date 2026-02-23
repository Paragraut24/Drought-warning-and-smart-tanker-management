# Real-Time Weather API Setup Guide

## Current Status
❌ **Using HARDCODED database data** (seeded fake rainfall records)

## To Enable Real-Time Weather Data

### Step 1: Get OpenWeatherMap API Key (FREE)

1. Go to: https://openweathermap.org/api
2. Click "Sign Up" (free account)
3. Verify your email
4. Go to: https://home.openweathermap.org/api_keys
5. Copy your API key

### Step 2: Add API Key to .env

Open `backend/.env` and update:

```env
OPENWEATHER_API_KEY=your_actual_api_key_here
```

### Step 3: Restart Backend Server

```bash
cd backend
npm start
```

## New API Endpoints Available

### 1. Get Current Weather for a Village
```
GET /api/weather/current/:villageId
```

**Example Response:**
```json
{
  "village": {
    "id": 1,
    "name": "Yavatmal",
    "district": "Yavatmal"
  },
  "weather": {
    "temperature": 32.5,
    "humidity": 65,
    "rainfall": 2.5,
    "weather": "Rain",
    "description": "light rain"
  },
  "timestamp": "2024-02-23T10:30:00.000Z"
}
```

### 2. Get 5-Day Weather Forecast
```
GET /api/weather/forecast/:villageId
```

**Example Response:**
```json
{
  "village": {
    "id": 1,
    "name": "Yavatmal"
  },
  "forecast": [
    {
      "date": "2024-02-23",
      "avgTemp": 31.2,
      "maxTemp": 35.0,
      "minTemp": 28.0,
      "totalRainfall": 5.2,
      "avgHumidity": 68
    }
  ]
}
```

### 3. Sync Weather Data to Database
```
POST /api/weather/sync/:villageId
```
Fetches current weather and saves rainfall to database.

### 4. Sync All Villages (Cron Job)
```
POST /api/weather/sync-all
```
Updates weather data for all villages at once.

## Recommended Setup

### Option A: Manual Sync
Call `/api/weather/sync-all` periodically to update database with real weather data.

### Option B: Automated Cron Job
Install node-cron:
```bash
cd backend
npm install node-cron
```

Add to `server.js`:
```javascript
import cron from 'node-cron';
import axios from 'axios';

// Sync weather data every hour
cron.schedule('0 * * * *', async () => {
  try {
    await axios.post('http://localhost:5000/api/weather/sync-all');
    console.log('Weather data synced successfully');
  } catch (error) {
    console.error('Weather sync failed:', error.message);
  }
});
```

## Testing Without API Key

The system will continue to work with seeded database data if no API key is provided. You'll get a 503 error when trying to access weather endpoints:

```json
{
  "error": "Weather service not configured",
  "message": "Please add OPENWEATHER_API_KEY to .env file"
}
```

## API Limits (Free Tier)

- **Calls per minute**: 60
- **Calls per day**: 1,000
- **Current weather**: ✅ Included
- **5-day forecast**: ✅ Included
- **Historical data**: ❌ Requires paid plan

## Files Created

1. ✅ `backend/services/weatherService.js` - Weather API integration
2. ✅ `backend/routes/weather.js` - Weather endpoints
3. ✅ Updated `backend/server.js` - Added weather routes

## Next Steps

1. Get your free API key from OpenWeatherMap
2. Add it to `backend/.env`
3. Restart the backend server
4. Test with: `GET /api/weather/current/1`
5. Set up automated sync with cron job (optional)
