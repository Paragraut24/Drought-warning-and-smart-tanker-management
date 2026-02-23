import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class WeatherService {
  constructor() {
    this.openWeatherKey = process.env.OPENWEATHER_API_KEY;
    this.weatherApiKey = process.env.WEATHER_API_KEY;
    this.openWeatherBaseUrl = 'https://api.openweathermap.org/data/2.5';
    this.weatherApiBaseUrl = 'https://api.weatherapi.com/v1';
  }

  // Fetch current weather from OpenWeatherMap
  async fetchOpenWeatherData(city) {
    try {
      if (!this.openWeatherKey) {
        throw new Error('OpenWeatherMap API key not configured');
      }

      const response = await axios.get(`${this.openWeatherBaseUrl}/weather`, {
        params: {
          q: `${city},IN`,
          appid: this.openWeatherKey,
          units: 'metric'
        },
        timeout: 10000
      });

      return {
        source: 'OpenWeatherMap',
        city: response.data.name,
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        rainfall: response.data.rain?.['1h'] || 0,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        windSpeed: response.data.wind.speed,
        clouds: response.data.clouds.all,
        timestamp: new Date(response.data.dt * 1000)
      };
    } catch (error) {
      console.error('OpenWeatherMap API error:', error.message);
      throw error;
    }
  }

  // Fetch current weather from WeatherAPI.com (more reliable for India)
  async fetchWeatherApiData(city) {
    try {
      if (!this.weatherApiKey) {
        throw new Error('WeatherAPI key not configured');
      }

      const response = await axios.get(`${this.weatherApiBaseUrl}/current.json`, {
        params: {
          key: this.weatherApiKey,
          q: city,
          aqi: 'no'
        },
        timeout: 10000
      });

      return {
        source: 'WeatherAPI',
        city: response.data.location.name,
        region: response.data.location.region,
        temperature: response.data.current.temp_c,
        humidity: response.data.current.humidity,
        pressure: response.data.current.pressure_mb,
        rainfall: response.data.current.precip_mm,
        description: response.data.current.condition.text,
        icon: response.data.current.condition.icon,
        windSpeed: response.data.current.wind_kph,
        clouds: response.data.current.cloud,
        timestamp: new Date(response.data.current.last_updated)
      };
    } catch (error) {
      console.error('WeatherAPI error:', error.message);
      throw error;
    }
  }

  // Fetch weather with fallback (try WeatherAPI first, then OpenWeather)
  async fetchWeatherData(city) {
    try {
      // Try WeatherAPI first (better for Indian cities)
      return await this.fetchWeatherApiData(city);
    } catch (error) {
      console.log('WeatherAPI failed, trying OpenWeatherMap...');
      try {
        return await this.fetchOpenWeatherData(city);
      } catch (error2) {
        throw new Error('Both weather APIs failed');
      }
    }
  }

  // Fetch weather for multiple villages
  async fetchMultipleVillages(villages) {
    const results = [];
    
    for (const village of villages) {
      try {
        const weatherData = await this.fetchWeatherData(village.name);
        results.push({
          villageId: village.id,
          villageName: village.name,
          district: village.district,
          weather: weatherData,
          success: true
        });
        
        // Wait 1 second between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          villageId: village.id,
          villageName: village.name,
          district: village.district,
          error: error.message,
          success: false
        });
      }
    }
    
    return results;
  }

  // Get 5-day forecast from OpenWeatherMap
  async fetchForecast(city) {
    try {
      if (!this.openWeatherKey) {
        throw new Error('OpenWeatherMap API key not configured');
      }

      const response = await axios.get(`${this.openWeatherBaseUrl}/forecast`, {
        params: {
          q: `${city},IN`,
          appid: this.openWeatherKey,
          units: 'metric'
        },
        timeout: 10000
      });

      return {
        city: response.data.city.name,
        forecast: response.data.list.map(item => ({
          date: new Date(item.dt * 1000),
          temperature: item.main.temp,
          humidity: item.main.humidity,
          rainfall: item.rain?.['3h'] || 0,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        }))
      };
    } catch (error) {
      console.error('Forecast API error:', error.message);
      throw error;
    }
  }
}

export default new WeatherService();
