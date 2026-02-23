import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weatherAPI, villageAPI } from '../services/api';

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadVillages();
  }, []);

  const loadVillages = async () => {
    try {
      const response = await villageAPI.getAll();
      setVillages(response.data);
    } catch (error) {
      console.error('Failed to load villages:', error);
    }
  };

  const fetchAllWeather = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await weatherAPI.getAllWeather();
      setWeatherData(response.data.data);
      setMessage({
        type: 'success',
        text: `✅ Fetched weather for ${response.data.successful}/${response.data.total} villages`
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Failed to fetch weather: ${error.response?.data?.error || error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVillageWeather = async (villageId) => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await weatherAPI.getVillageWeather(villageId);
      setSelectedVillage(response.data);
      setMessage({
        type: 'success',
        text: `✅ Weather data loaded for ${response.data.village.name}`
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Failed to fetch weather: ${error.response?.data?.error || error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const syncWeatherToDatabase = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const response = await weatherAPI.syncWeather();
      setMessage({
        type: 'success',
        text: `✅ Synced! ${response.data.rainfallRecordsSaved} rainfall records saved to database`
      });
      // Refresh weather data
      await fetchAllWeather();
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Sync failed: ${error.response?.data?.error || error.message}`
      });
    } finally {
      setSyncing(false);
    }
  };

  const getWeatherIcon = (description) => {
    const desc = description?.toLowerCase() || '';
    if (desc.includes('rain') || desc.includes('drizzle')) return '🌧️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
    if (desc.includes('storm') || desc.includes('thunder')) return '⛈️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
    return '🌤️';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Live Weather Data
        </h1>
        <p className="text-gray-600">
          मौसम डेटा - Real-time weather from OpenWeatherMap & WeatherAPI
        </p>
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchAllWeather}
          disabled={loading}
          className="card p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">🌍</span>
            <div className="text-left">
              <h3 className="font-bold text-gray-800">Fetch All Villages</h3>
              <p className="text-sm text-gray-600">Get weather for 20 villages</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={syncWeatherToDatabase}
          disabled={syncing || weatherData.length === 0}
          className="card p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">💾</span>
            <div className="text-left">
              <h3 className="font-bold text-gray-800">Sync to Database</h3>
              <p className="text-sm text-gray-600">Save rainfall records</p>
            </div>
          </div>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">🔍</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-2">Single Village</h3>
              <select
                onChange={(e) => e.target.value && fetchVillageWeather(e.target.value)}
                className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm"
                disabled={loading}
              >
                <option value="">Select village...</option>
                {villages.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.district})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Message Display */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border-2 ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Fetching weather data...</p>
          </div>
        </div>
      )}

      {/* Selected Village Detail */}
      {selectedVillage && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {selectedVillage.village.name}
              </h2>
              <p className="text-lg opacity-90">
                {selectedVillage.village.district} District
              </p>
            </div>
            <span className="text-6xl">
              {getWeatherIcon(selectedVillage.weather.description)}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-sm opacity-75 mb-1">Temperature</p>
              <p className="text-3xl font-bold">{selectedVillage.weather.temperature}°C</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-sm opacity-75 mb-1">Humidity</p>
              <p className="text-3xl font-bold">{selectedVillage.weather.humidity}%</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-sm opacity-75 mb-1">Rainfall</p>
              <p className="text-3xl font-bold">{selectedVillage.weather.rainfall} mm</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-sm opacity-75 mb-1">Wind Speed</p>
              <p className="text-3xl font-bold">{selectedVillage.weather.windSpeed}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-lg capitalize">{selectedVillage.weather.description}</p>
            <p className="text-sm opacity-75">
              Source: {selectedVillage.weather.source}
            </p>
          </div>
        </motion.div>
      )}

      {/* Weather Grid */}
      {weatherData.length > 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weatherData.map((data, idx) => (
            <motion.div
              key={data.villageId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`card p-6 ${
                data.success
                  ? 'hover:shadow-lg cursor-pointer'
                  : 'opacity-60 bg-gray-50'
              }`}
              onClick={() => data.success && fetchVillageWeather(data.villageId)}
            >
              {data.success ? (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {data.villageName}
                      </h3>
                      <p className="text-sm text-gray-600">{data.district}</p>
                    </div>
                    <span className="text-4xl">
                      {getWeatherIcon(data.weather.description)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Temperature</p>
                      <p className="text-xl font-bold text-gray-800">
                        {data.weather.temperature}°C
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Humidity</p>
                      <p className="text-xl font-bold text-gray-800">
                        {data.weather.humidity}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Rainfall</p>
                      <p className="text-xl font-bold text-blue-600">
                        {data.weather.rainfall} mm
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Clouds</p>
                      <p className="text-xl font-bold text-gray-800">
                        {data.weather.clouds}%
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 capitalize">
                    {data.weather.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {data.weather.source}
                  </p>
                </>
              ) : (
                <div className="text-center py-4">
                  <span className="text-3xl mb-2 block">❌</span>
                  <p className="font-bold text-gray-800">{data.villageName}</p>
                  <p className="text-sm text-red-600 mt-2">{data.error}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-blue-50 border border-blue-200 p-6 rounded-xl"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-bold text-blue-800 mb-2">
              About Live Weather Integration
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Real-time data from OpenWeatherMap & WeatherAPI</li>
              <li>• Automatic fallback if one API fails</li>
              <li>• Click "Sync to Database" to save rainfall records</li>
              <li>• Data updates every time you fetch</li>
              <li>• Free tier: 1000 calls/day (OpenWeather), 1M calls/month (WeatherAPI)</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Weather;
