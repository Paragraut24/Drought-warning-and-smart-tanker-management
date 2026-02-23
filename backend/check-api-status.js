import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function checkAPIStatus() {
  const apiKey = process.env.WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;
  
  console.log('🔍 Weather API Status Check\n');
  console.log('API Key:', apiKey ? apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4) : 'NOT SET');
  console.log('');
  
  if (!apiKey) {
    console.log('❌ No API key found in .env file\n');
    console.log('Add WEATHER_API_KEY to your .env file');
    console.log('Get free key from: https://www.weatherapi.com/signup.aspx\n');
    return;
  }
  
  // Test with WeatherAPI.com
  const testUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=20.3974,78.1320&aqi=no`;
  
  console.log('Testing WeatherAPI.com endpoint...');
  console.log('Location: Yavatmal, Maharashtra');
  console.log('');
  
  try {
    const response = await axios.get(testUrl);
    console.log('✅ SUCCESS! API is working!\n');
    console.log('📍 Location:', response.data.location.name + ', ' + response.data.location.region);
    console.log('🌡️  Temperature:', response.data.current.temp_c + '°C');
    console.log('💧 Humidity:', response.data.current.humidity + '%');
    console.log('🌧️  Rainfall:', response.data.current.precip_mm + ' mm');
    console.log('☁️  Weather:', response.data.current.condition.text);
    console.log('🕐 Last Updated:', response.data.current.last_updated);
    console.log('');
    console.log('🎉 Your API key is ACTIVE and working!');
    console.log('✅ System is now fetching REAL-TIME weather data!\n');
    console.log('📊 Data Source: LIVE API (WeatherAPI.com)\n');
    
  } catch (error) {
    console.log('❌ API call failed\n');
    console.log('Status Code:', error.response?.status);
    console.log('Error Message:', error.response?.data?.error?.message || error.message);
    console.log('');
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('🔴 API Key Issue:');
      console.log('   1. Key is invalid or incorrect');
      console.log('   2. Get a new key from: https://www.weatherapi.com/my/');
      console.log('   3. Add to .env as: WEATHER_API_KEY=your_key_here');
      console.log('');
      console.log('📝 Current Status: Using HARDCODED database data');
    } else if (error.response?.status === 429) {
      console.log('⚠️  Rate limit exceeded');
      console.log('   Free tier: 1 million calls/month');
    } else {
      console.log('⚠️  Network or other error');
      console.log('   Check your internet connection');
    }
    console.log('');
  }
}

checkAPIStatus();
