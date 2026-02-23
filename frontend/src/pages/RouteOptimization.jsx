import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { villageAPI, tankerAPI } from '../services/api';

const RouteOptimization = () => {
  const [villages, setVillages] = useState([]);
  const [selectedVillages, setSelectedVillages] = useState([]);
  const [startPoint, setStartPoint] = useState({ latitude: 20.5937, longitude: 78.9629 });
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleOptimize = async () => {
    if (selectedVillages.length === 0) {
      alert('Please select at least one village');
      return;
    }

    setLoading(true);
    try {
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
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white mb-8"
      >
        Route Optimization
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="clay-card p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Select Villages</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {villages.map((village) => (
              <motion.div
                key={village.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center p-3 bg-gray-50 rounded-xl"
              >
                <input
                  type="checkbox"
                  checked={selectedVillages.includes(village.id.toString())}
                  onChange={() => toggleVillage(village.id.toString())}
                  className="mr-3"
                />
                <span>{village.name} - {village.district}</span>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOptimize}
            disabled={loading}
            className="clay-button w-full mt-6 py-3 text-gray-700 font-semibold"
          >
            {loading ? 'Optimizing...' : 'Optimize Route'}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="clay-card p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Optimized Route</h2>
          {route ? (
            <div>
              <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600">Total Distance</p>
                <p className="text-2xl font-bold text-blue-600">{route.totalDistance} km</p>
                <p className="text-sm text-gray-600 mt-2">Estimated Time</p>
                <p className="text-xl font-bold text-blue-600">{route.estimatedTime} hours</p>
              </div>

              <div className="space-y-3">
                {route.route.map((stop, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{stop.name}</p>
                      <p className="text-sm text-gray-600">
                        {stop.distanceFromPrevious.toFixed(2)} km from previous
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Select villages and click optimize to see the route
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RouteOptimization;
