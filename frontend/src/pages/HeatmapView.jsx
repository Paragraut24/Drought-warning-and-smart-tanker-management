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



      {/* Priority Map (moved from Dashboard) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <LeafletPriorityMap />
      </motion.div>

      {/* Tanker Statistics (moved from Dashboard) */}
      
    </div>
  );
};

export default HeatmapView;
