import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { alertAPI } from '../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await alertAPI.getAll();
      setAlerts(response.data);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await alertAPI.resolve(id);
      loadAlerts();
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white mb-8"
      >
        Alerts & Notifications
      </motion.h1>

      <div className="space-y-4">
        {alerts.map((alert, idx) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`clay-card p-6 ${
              alert.is_resolved ? 'opacity-60' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    alert.severity === 'critical' ? 'bg-red-500 text-white' :
                    alert.severity === 'alert' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-bold">{alert.Village?.name}</h3>
                </div>
                <p className="text-gray-700 mb-2">{alert.message}</p>
                {alert.wsi_score && (
                  <p className="text-sm text-gray-600">WSI Score: {alert.wsi_score}</p>
                )}
              </div>
              {!alert.is_resolved && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleResolve(alert.id)}
                  className="clay-button px-4 py-2 text-sm"
                >
                  Resolve
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
