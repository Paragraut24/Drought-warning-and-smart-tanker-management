import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { villageAPI, tankerAPI } from '../services/api';

const RouteOptimization = () => {
  const [villages, setVillages] = useState([]);
  const [selectedVillages, setSelectedVillages] = useState([]);
  const [startVillage, setStartVillage] = useState('');
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVillages();
  }, []);

  const loadVillages = async () => {
    try {
      const response = await villageAPI.getAll();
      setVillages(response.data);
      // Set Nagpur as default starting point
      const nagpur = response.data.find(v => v.name.toLowerCase().includes('nagpur'));
      if (nagpur) {
        setStartVillage(nagpur.id.toString());
      }
    } catch (error) {
      console.error('Failed to load villages:', error);
    }
  };

  const handleOptimize = async () => {
    if (!startVillage) {
      alert('Please select a starting point');
      return;
    }
    
    if (selectedVillages.length === 0) {
      alert('Please select at least one destination village');
      return;
    }

    setLoading(true);
    try {
      const startVillageData = villages.find(v => v.id === parseInt(startVillage));
      const startPoint = {
        latitude: parseFloat(startVillageData.latitude),
        longitude: parseFloat(startVillageData.longitude)
      };

      const destinations = selectedVillages.map(id => {
        const village = villages.find(v => v.id === parseInt(id));
        return {
          id: village.id,
          name: village.name,
          latitude: parseFloat(village.latitude),
          longitude: parseFloat(village.longitude)
        };
      });

      const response = await tankerAPI.optimizeRoute({ startPoint, destinations });
      setRoute(response.data);
    } catch (error) {
      console.error('Optimization failed:', error);
      alert('Route optimization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleVillage = (villageId) => {
    setSelectedVillages(prev =>
      prev.includes(villageId)
        ? prev.filter(id => id !== villageId)
        : [...prev, villageId]
    );
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Route Optimization</h1>
        <p className="text-gray-600">मार्ग अनुकूलन - AI-powered shortest path calculation for tanker delivery</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Village Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Route Planning</h2>
            <p className="text-sm text-gray-600">Configure your water delivery route</p>
          </div>

          {/* Starting Point Selection */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Starting Point (Depot/Base) <span className="text-red-500">*</span>
            </label>
            <select
              value={startVillage}
              onChange={(e) => setStartVillage(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select Starting Location</option>
              {villages.map((village) => (
                <option key={village.id} value={village.id}>
                  {village.name} - {village.district}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-600 mt-2">
              💡 Select the depot or base location where tankers will start their journey
            </p>
          </div>

          {/* Destination Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Select Destinations <span className="text-red-500">*</span>
            </h3>
            <div className="mb-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-semibold text-purple-800">
                Selected: {selectedVillages.length} villages
              </p>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {villages
                .filter(v => v.id.toString() !== startVillage)
                .map((village) => (
                  <motion.label
                    key={village.id}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedVillages.includes(village.id.toString())
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedVillages.includes(village.id.toString())}
                      onChange={() => toggleVillage(village.id.toString())}
                      className="mr-3 w-5 h-5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{village.name}</p>
                      <p className="text-sm text-gray-600">{village.district}</p>
                    </div>
                    <span className="text-2xl">📍</span>
                  </motion.label>
                ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOptimize}
            disabled={loading || !startVillage || selectedVillages.length === 0}
            className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Optimizing Route...
              </span>
            ) : (
              '🗺️ Optimize Route'
            )}
          </motion.button>
        </motion.div>

        {/* Optimized Route Display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Optimized Route</h2>
            <p className="text-sm text-gray-600">AI-calculated shortest path for water delivery</p>
          </div>

          {route ? (
            <div>
              {/* Route Summary */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Distance</p>
                  <p className="text-3xl font-bold text-blue-600">{route.totalDistance} km</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Estimated Time</p>
                  <p className="text-3xl font-bold text-purple-600">{route.estimatedTime} hrs</p>
                </div>
              </div>

              {/* Route Steps */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 mb-3">Route Sequence:</h3>
                
                {/* Starting Point */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-500"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center mr-4 font-bold flex-shrink-0">
                    🏁
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-1">
                      {villages.find(v => v.id === parseInt(startVillage))?.name || 'Starting Point'}
                    </p>
                    <p className="text-sm text-green-700 font-semibold">Starting Point (Depot)</p>
                  </div>
                </motion.div>

                {/* Route Stops */}
                {route.route.map((stop, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 1) * 0.1 }}
                    className="flex items-start p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center mr-4 font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-1">{stop.name}</p>
                      {index > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📏</span>
                          <span>{stop.distanceFromPrevious.toFixed(2)} km from previous stop</span>
                        </div>
                      )}
                      {index === 0 && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <span>📏</span>
                          <span>{stop.distanceFromPrevious.toFixed(2)} km from depot</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Route Info */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-2">
                  <span className="text-xl">✓</span>
                  <div>
                    <p className="font-semibold text-green-800 mb-1">Route Optimized Successfully</p>
                    <p className="text-sm text-green-700">
                      This route minimizes total travel distance and ensures efficient water delivery to all selected villages.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">🗺️</p>
              <p className="text-xl font-semibold text-gray-800 mb-2">No Route Calculated</p>
              <p className="text-gray-600">Select villages from the list and click "Optimize Route"</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl">🤖</span>
          <div>
            <h3 className="font-bold text-lg mb-1">AI-Powered Route Optimization</h3>
            <p className="text-sm opacity-90">
              JalRakshak uses advanced algorithms to calculate the shortest path between multiple villages, 
              reducing fuel costs and ensuring faster water delivery to drought-affected areas in Vidarbha.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RouteOptimization;
