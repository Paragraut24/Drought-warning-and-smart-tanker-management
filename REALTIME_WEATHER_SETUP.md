# ✅ Real-Time Weather Setup (2 Minutes)

## Quick Setup - WeatherAPI.com (Recommended)

### Step 1: Get FREE API Key (Instant Activation)

1. **Go to**: https://www.weatherapi.com/signup.aspx

2. **Sign Up** (takes 30 seconds):
   - Enter your email
   - Create a password
   - Click "Sign Up"

3. **Verify Email**:
   - Check your inbox
   - Click verification link

4. **Get Your Key**:
   - Login to: https://www.weatherapi.com/my/
   - Your API key is shown immediately
   - **COPY IT** (looks like: abc123def456...)

### Step 2: Add to .env File

Open `backend/.env` and find this line:
```env
WEATHER_API_KEY=
```

Replace with your key:
```env
WEATHER_API_KEY=paste_your_key_here
```

**Example:**
```env
WEATHER_API_KEY=abc123def456789xyz
```

### Step 3: Save and Restart

1. Save the file (Ctrl + S)
2. Restart backend server
3. Test it!

### Step 4: Test Real-Time Weather

Run this command:
```bash
cd backend
node check-api-status.js
```

You should see:
```
✅ SUCCESS! API is working!
📍 Location: Yavatmal, Maharashtra
🌡️  Temperature: 32.5°C
💧 Humidity: 65%
🌧️  Rainfall: 0 mm
☁️  Weather: Partly cloudy
🎉 Your API key is ACTIVE and working!
✅ System is now fetching REAL-TIME weather data!
```

## Why WeatherAPI.com?

| Feature | WeatherAPI.com | OpenWeatherMap |
|---------|---------------|----------------|
| Activation | ✅ Instant | ❌ 10-15 min wait |
| Free Calls | ✅ 1M/month | ❌ 1K/day |
| Reliability | ✅ High | ⚠️ Medium |
| Setup | ✅ Easy | ⚠️ Complex |

## API Endpoints Available

Once configured, you can use:

1. **Current Weather**: `GET /api/weather/current/:villageId`
2. **5-Day Forecast**: `GET /api/weather/forecast/:villageId`
3. **Sync to Database**: `POST /api/weather/sync/:villageId`
4. **Sync All Villages**: `POST /api/weather/sync-all`

## Free Tier Limits

- ✅ 1,000,000 calls per month
- ✅ Current weather data
- ✅ 3-day forecast (free)
- ✅ 5-day forecast (free)
- ✅ No credit card required
- ✅ Instant activation

## Troubleshooting

### If test fails:
1. Check if key is copied correctly (no spaces)
2. Verify email is confirmed
3. Check internet connection
4. Try generating a new key

### Still using hardcoded data?
- Make sure you saved the .env file
- Restart the backend server
- Run the test script again

## What Happens Now?

✅ **Before**: Using fake seeded rainfall data from 2020
✅ **After**: Fetching live weather from WeatherAPI.com
✅ **Updates**: Real-time temperature, humidity, rainfall
✅ **Forecast**: 5-day weather predictions

Your water governance system will now have REAL weather data! 🌦️
