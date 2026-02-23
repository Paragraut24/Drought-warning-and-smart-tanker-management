import express from 'express';
import { fetchCurrentWeather, fetchWeatherForecast } from '../services/weatherService.js';
import { Village, RainfallRecord } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/weather/current/:villageId
 * Fetch real-time weather for a specific village
 */
router.get('/current/:villageId', authenticate, async (req, res, next) => {
  try {
    const village = await Village.findByPk(req.params.villageId);
    
    if (!village) {
      return res.status(404).json({ error: 'Village not found' });
    }

    const weather = await fetchCurrentWeather(village.latitude, village.longitude);
    
    res.json({
      village: {
        id: village.id,
        name: village.name,
        district: village.district
      },
      weather,
      timestamp: new Date()
    });
  } catch (error) {
    if (error.message.includes('API key')) {
      return res.status(503).json({ 
        error: 'Weather service not configured',
        message: 'Please add OPENWEATHER_API_KEY to .env file'
      });
    }
    next(error);
  }
});

/**
 * GET /api/weather/forecast/:villageId
 * Fetch 5-day weather forecast for a village
 */
router.get('/forecast/:villageId', authenticate, async (req, res, next) => {
  try {
    const village = await Village.findByPk(req.params.villageId);
    
    if (!village) {
      return res.status(404).json({ error: 'Village not found' });
    }

    const forecast = await fetchWeatherForecast(village.latitude, village.longitude);
    
    res.json({
      village: {
        id: village.id,
        name: village.name,
        district: village.district
      },
      forecast,
      timestamp: new Date()
    });
  } catch (error) {
    if (error.message.includes('API key')) {
      return res.status(503).json({ 
        error: 'Weather service not configured',
        message: 'Please add OPENWEATHER_API_KEY to .env file'
      });
    }
    next(error);
  }
});

/**
 * POST /api/weather/sync/:villageId
 * Fetch current weather and save to database
 */
router.post('/sync/:villageId', authenticate, async (req, res, next) => {
  try {
    const village = await Village.findByPk(req.params.villageId);
    
    if (!village) {
      return res.status(404).json({ error: 'Village not found' });
    }

    const weather = await fetchCurrentWeather(village.latitude, village.longitude);
    
    // Save rainfall data to database
    const rainfallRecord = await RainfallRecord.create({
      village_id: village.id,
      record_date: new Date(),
      rainfall_mm: weather.rainfall,
      is_historical: false
    });

    res.json({
      message: 'Weather data synced successfully',
      village: village.name,
      weather,
      rainfallRecord
    });
  } catch (error) {
    if (error.message.includes('API key')) {
      return res.status(503).json({ 
        error: 'Weather service not configured',
        message: 'Please add OPENWEATHER_API_KEY to .env file'
      });
    }
    next(error);
  }
});

/**
 * POST /api/weather/sync-all
 * Sync weather data for all villages (run as cron job)
 */
router.post('/sync-all', authenticate, async (req, res, next) => {
  try {
    const villages = await Village.findAll();
    const results = [];

    for (const village of villages) {
      try {
        const weather = await fetchCurrentWeather(village.latitude, village.longitude);
        
        await RainfallRecord.create({
          village_id: village.id,
          record_date: new Date(),
          rainfall_mm: weather.rainfall,
          is_historical: false
        });

        results.push({
          village: village.name,
          status: 'success',
          rainfall: weather.rainfall
        });
      } catch (error) {
        results.push({
          village: village.name,
          status: 'failed',
          error: error.message
        });
      }
    }

    res.json({
      message: 'Bulk weather sync completed',
      total: villages.length,
      results
    });
  } catch (error) {
    next(error);
  }
});

export default router;
