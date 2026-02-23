import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { alertAPI } from '../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, critical, alert, resolved

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

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'resolved') return alert.is_resolved;
    return alert.severity === filter && !alert.is_resolved;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Alerts & Notifications</h1>
        <p className="text-gray-600">अलर्ट और सूचनाएं - Real-time water crisis alerts for Vidarbha</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <p className="text-sm text-gray-600 mb-1">Total Alerts</p>
          <p className="text-3xl font-bold text-gray-800">{alerts.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 bg-gradient-to-br from-red-50 to-red-100"
        >
          <p className="text-sm text-gray-600 mb-1">Critical</p>
          <p className="text-3xl font-bold text-red-600">
            {alerts.filter(a => a.severity === 'critical' && !a.is_resolved).length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 bg-gradient-to-br from-yellow-50 to-yellow-100"
        >
          <p className="text-sm text-gray-600 mb-1">Alert</p>
          <p className="text-3xl font-bold text-yellow-600">
            {alerts.filter(a => a.severity === 'alert' && !a.is_resolved).length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 bg-gradient-to-br from-green-50 to-green-100"
        >
          <p className="text-sm text-gray-600 mb-1">Resolved</p>
          <p className="text-3xl font-bold text-green-600">
            {alerts.filter(a => a.is_resolved).length}
          </p>
        </motion.div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {['all', 'critical', 'alert', 'resolved'].map((f) => (
          <motion.button
            key={f}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, idx) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`card p-6 ${alert.is_resolved ? 'opacity-60' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    alert.severity === 'critical' ? 'bg-red-500 text-white' :
                    alert.severity === 'alert' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">{alert.Village?.name || 'Unknown Village'}</h3>
                  <span className="text-sm text-gray-500">{alert.Village?.district}</span>
                </div>
                <p className="text-gray-700 mb-3">{alert.message}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {alert.wsi_score && (
                    <span>WSI Score: <span className="font-semibold">{alert.wsi_score.toFixed(1)}</span></span>
                  )}
                  <span>Created: {new Date(alert.createdAt).toLocaleString('en-IN')}</span>
                  {alert.is_resolved && (
                    <span className="text-green-600 font-semibold">✓ Resolved</span>
                  )}
                </div>
              </div>
              {!alert.is_resolved && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleResolve(alert.id)}
                  className="btn-secondary px-4 py-2 text-sm ml-4"
                >
                  Mark Resolved
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-4">✅</p>
            <p className="text-xl font-semibold text-gray-800 mb-2">No Alerts Found</p>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'All villages have sufficient water supply' 
                : `No ${filter} alerts at this time`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
