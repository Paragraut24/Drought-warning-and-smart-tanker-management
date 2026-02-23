import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;
const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1';

/**
 * Fetch real-time weather data from WeatherAPI.com
 */
export async function fetchCurrentWeather(latitude, longitude) {
  if (!WEATHER_API_KEY) {
    throw new Error('Weather API key not configured. Add WEATHER_API_KEY to .env file');
  }

  try {
    const response = await axios.get(`${WEATHER_API_BASE_URL}/current.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: `${latitude},${longitude}`,
        aqi: 'no'
      }
    });

    return {
      temperature: response.data.current.temp_c,
      humidity: response.data.current.humidity,
      rainfall: response.data.current.precip_mm || 0, // Rainfall in mm
      weather: response.data.current.condition.text,
      description: response.data.current.condition.text
    };
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw error;
  }
}

/**
 * Fetch weather forecast for next 5 days
 */
export async function fetchWeatherForecast(latitude, longitude) {
  if (!WEATHER_API_KEY) {
    throw new Error('Weather API key not configured');
  }

  try {
    const response = await axios.get(`${WEATHER_API_BASE_URL}/forecast.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: `${latitude},${longitude}`,
        days: 5,
        aqi: 'no'
      }
    });

    // Process forecast data
    const dailyForecasts = response.data.forecast.forecastday.map(day => ({
      date: day.date,
      avgTemp: day.day.avgtemp_c,
      maxTemp: day.day.maxtemp_c,
      minTemp: day.day.mintemp_c,
      totalRainfall: day.day.totalprecip_mm,
      avgHumidity: day.day.avghumidity
    }));

    return dailyForecasts;
  } catch (error) {
    console.error('Error fetching forecast data:', error.message);
    throw error;
  }
}

/**
 * Fetch historical weather data (requires paid API plan)
 * Alternative: Use free current data and store it over time
 */
export async function fetchHistoricalWeather(latitude, longitude, startDate, endDate) {
  // Note: Historical data requires WeatherAPI paid subscription
  // For free tier, you should store current weather data daily
  throw new Error('Historical weather data requires paid API subscription');
}

export default {
  fetchCurrentWeather,
  fetchWeatherForecast,
  fetchHistoricalWeather
};
