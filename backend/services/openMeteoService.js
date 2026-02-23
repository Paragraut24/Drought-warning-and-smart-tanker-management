import axios from 'axios';

const OPEN_METEO_HISTORICAL = 'https://archive-api.open-meteo.com/v1/archive';
const OPEN_METEO_CURRENT = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetch historical daily rainfall from Open-Meteo (free, no API key).
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate   - YYYY-MM-DD
 * @returns {Array<{date: string, rainfall_mm: number}>}
 */
export async function fetchHistoricalRainfall(lat, lon, startDate, endDate) {
  const response = await axios.get(OPEN_METEO_HISTORICAL, {
    params: {
      latitude: lat,
      longitude: lon,
      start_date: startDate,
      end_date: endDate,
      daily: 'precipitation_sum',
      timezone: 'Asia/Kolkata'
    }
  });

  const days = response.data.daily.time;
  const precip = response.data.daily.precipitation_sum;

  return days.map((date, i) => ({
    date,
    rainfall_mm: precip[i] ?? 0
  }));
}

/**
 * Fetch today's rainfall (and optionally yesterday's) from Open-Meteo.
 * Uses the forecast endpoint with past_days=1 to get both.
 * @param {number} lat
 * @param {number} lon
 * @returns {Array<{date: string, rainfall_mm: number}>}
 */
export async function fetchTodayRainfall(lat, lon) {
  const response = await axios.get(OPEN_METEO_CURRENT, {
    params: {
      latitude: lat,
      longitude: lon,
      daily: 'precipitation_sum',
      past_days: 1,
      forecast_days: 1,
      timezone: 'Asia/Kolkata'
    }
  });

  const days = response.data.daily.time;
  const precip = response.data.daily.precipitation_sum;

  return days.map((date, i) => ({
    date,
    rainfall_mm: precip[i] ?? 0
  }));
}

export default { fetchHistoricalRainfall, fetchTodayRainfall };
