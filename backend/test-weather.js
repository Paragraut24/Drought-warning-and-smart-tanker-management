import { fetchCurrentWeather, fetchWeatherForecast } from './services/weatherService.js';
import dotenv from 'dotenv';

dotenv.config();

async function testWeatherAPI() {
  console.log('🌦️  Testing Real-Time Weather API\n');
  
  // Check if API key is configured
  if (!process.env.OPENWEATHER_API_KEY) {
    console.log('❌ OPENWEATHER_API_KEY not found in .env file');
    console.log('   Please add your API key to continue\n');
    return;
  }
  
  console.log('✅ API Key found:', process.env.OPENWEATHER_API_KEY.substring(0, 8) + '...\n');
  
  // Test coordinates for Yavatmal, Maharashtra
  const latitude = 20.3974;
  const longitude = 78.1320;
  const villageName = 'Yavatmal';
  
  try {
    console.log(`📍 Testing location: ${villageName}`);
    console.log(`   Coordinates: ${latitude}, ${longitude}\n`);
    
    // Test 1: Current Weather
    console.log('Test 1: Fetching current weather...');
    const currentWeather = await fetchCurrentWeather(latitude, longitude);
    
    console.log('✅ SUCCESS! Real-time weather data received:\n');
    console.log('   Temperature:', currentWeather.temperature + '°C');
    console.log('   Humidity:', currentWeather.humidity + '%');
    console.log('   Rainfall (1h):', currentWeather.rainfall + ' mm');
    console.log('   Weather:', currentWeather.weather);
    console.log('   Description:', currentWeather.description);
    console.log('');
    
    // Test 2: Weather Forecast
    console.log('Test 2: Fetching 5-day forecast...');
    const forecast = await fetchWeatherForecast(latitude, longitude);
    
    console.log('✅ SUCCESS! Forecast data received:\n');
    console.log(`   Got ${forecast.length} days of forecast data:`);
    forecast.slice(0, 3).forEach(day => {
      console.log(`   ${day.date}: ${day.minTemp.toFixed(1)}°C - ${day.maxTemp.toFixed(1)}°C, Rain: ${day.totalRainfall.toFixed(1)}mm`);
    });
    console.log('');
    
    console.log('🎉 All tests passed!');
    console.log('✅ Your system is now fetching REAL-TIME weather data from OpenWeatherMap API\n');
    console.log('📊 Data Source: LIVE API (not hardcoded database)\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response?.status === 401) {
      console.error('\n   → API key is invalid or not activated yet');
      console.error('   → Wait 10-15 minutes after creating the key');
      console.error('   → Or check if the key is correct in .env file\n');
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n   → Cannot reach OpenWeatherMap servers');
      console.error('   → Check your internet connection\n');
    } else {
      console.error('\n   → Error details:', error.response?.data || error.message);
    }
  }
}

testWeatherAPI();
