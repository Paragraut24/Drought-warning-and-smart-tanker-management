import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analysisAPI } from '../services/api';

const HeatmapView = () => {
  const [wsiData, setWsiData] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'alert': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getSeverityBorder = (severity) => {
    switch (severity) {
      case 'critical': return 'border-red-500';
      case 'alert': return 'border-yellow-500';
      default: return 'border-green-500';
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
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Water Stress Heatmap</h1>
        <p className="text-gray-600">जल तनाव मानचित्र - Vidarbha Region Water Crisis Visualization</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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

      {/* Map Alternative - Grid View */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-6"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Vidarbha Villages Status</h2>
          <p className="text-sm text-gray-600">Geographic distribution of water stress across the region</p>
        </div>

        {/* Legend */}
        <div className="flex gap-6 justify-center items-center p-4 bg-gray-50 rounded-lg mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Normal (सामान्य)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-medium">Alert (चेतावनी)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium">Critical (गंभीर)</span>
          </div>
        </div>

        {/* Villages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wsiData.map((village, idx) => (
            <motion.div
              key={village.villageId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-xl border-l-4 cursor-pointer ${
                village.severity === 'critical' 
                  ? 'bg-red-50 border-red-500' 
                  : village.severity === 'alert' 
                  ? 'bg-yellow-50 border-yellow-500' 
                  : 'bg-green-50 border-green-500'
              }`}
              onClick={() => setSelectedVillage(village)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{village.villageName}</h3>
                  <p className="text-sm text-gray-600">{village.district}</p>
                </div>
                <span className="text-2xl">
                  {village.severity === 'critical' ? '🚨' : village.severity === 'alert' ? '⚠️' : '✅'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">WSI Score:</span>
                  <span className={`font-bold ${
                    village.severity === 'critical' ? 'text-red-600' :
                    village.severity === 'alert' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {village.wsi.toFixed(1)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    village.severity === 'critical' ? 'bg-red-200 text-red-800' :
                    village.severity === 'alert' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {village.severity.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  📍 Lat: {parseFloat(village.latitude).toFixed(4)}, Lng: {parseFloat(village.longitude).toFixed(4)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Village Details */}
        {selectedVillage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold mb-2">{selectedVillage.villageName}</h3>
                <p className="text-lg opacity-90 mb-4">{selectedVillage.district} District</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-75">Water Stress Index</p>
                    <p className="text-3xl font-bold">{selectedVillage.wsi.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75">Severity Level</p>
                    <p className="text-2xl font-bold capitalize">{selectedVillage.severity}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedVillage(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}

        {/* Info Note */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <span className="text-xl">💡</span>
            <div>
              <p className="font-semibold text-blue-800 mb-1">Interactive Map View</p>
              <p className="text-sm text-blue-700">
                Click on any village card to view detailed information. The color coding indicates water stress levels:
                Red (Critical) requires immediate tanker allocation, Yellow (Alert) needs monitoring, and Green (Normal) has sufficient water supply.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeatmapView;
