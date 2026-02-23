import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analysisAPI } from '../services/api';
import TankerStatistics from '../components/TankerStatistics';
import LeafletPriorityMap from '../components/LeafletPriorityMap';

const HeatmapView = () => {
  const [wsiData, setWsiData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await analysisAPI.getAllWSI();
      setWsiData(response.data);
    } catch (error) {
      console.error('Failed to load WSI data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Vidarbha map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Water Stress Heatmap</h1>
        <p className="text-gray-600">जल तनाव मानचित्र - Vidarbha Region Water Crisis Visualization</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 bg-gradient-to-br from-red-50 to-red-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Critical Villages</p>
              <p className="text-3xl font-bold text-red-600">
                {wsiData.filter(v => v.severity === 'critical').length}
              </p>
            </div>
            <span className="text-4xl">🚨</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 bg-gradient-to-br from-yellow-50 to-yellow-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Alert Villages</p>
              <p className="text-3xl font-bold text-yellow-600">
                {wsiData.filter(v => v.severity === 'alert').length}
              </p>
            </div>
            <span className="text-4xl">⚠️</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 bg-gradient-to-br from-green-50 to-green-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Normal Villages</p>
              <p className="text-3xl font-bold text-green-600">
                {wsiData.filter(v => v.severity === 'normal').length}
              </p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </motion.div>
      </div>

      {/* Priority Map (moved from Dashboard) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <LeafletPriorityMap />
      </motion.div>

      {/* Tanker Statistics (moved from Dashboard) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Tanker Deployment Status</h2>
          <p className="text-sm text-gray-500">टैंकर तैनाती स्थिति - Real-time Tracking</p>
        </div>
        <TankerStatistics />
      </motion.div>
    </div>
  );
};

export default HeatmapView;
