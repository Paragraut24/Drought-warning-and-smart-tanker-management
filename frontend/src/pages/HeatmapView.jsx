import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { analysisAPI } from '../services/api';

const HeatmapView = () => {
  const [wsiData, setWsiData] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '12px'
  };

  const center = {
    lat: 20.5937,
    lng: 78.9629
  };

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

  const getMarkerColor = (severity) => {
    switch (severity) {
      case 'critical': return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
      case 'alert': return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
      default: return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
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

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-6"
      >
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={7}
          >
            {wsiData.map((village) => (
              <Marker
                key={village.villageId}
                position={{
                  lat: parseFloat(village.latitude) || center.lat,
                  lng: parseFloat(village.longitude) || center.lng
                }}
                icon={getMarkerColor(village.severity)}
                onClick={() => setSelectedVillage(village)}
              />
            ))}

            {selectedVillage && (
              <InfoWindow
                position={{
                  lat: parseFloat(selectedVillage.latitude) || center.lat,
                  lng: parseFloat(selectedVillage.longitude) || center.lng
                }}
                onCloseClick={() => setSelectedVillage(null)}
              >
                <div className="p-2">
                  <h3 className="font-bold text-lg">{selectedVillage.villageName}</h3>
                  <p className="text-sm text-gray-600">{selectedVillage.district}</p>
                  <p className="mt-2">WSI Score: <span className="font-bold">{selectedVillage.wsi.toFixed(1)}</span></p>
                  <p className="capitalize">
                    Status: <span className={`font-bold ${
                      selectedVillage.severity === 'critical' ? 'text-red-600' :
                      selectedVillage.severity === 'alert' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>{selectedVillage.severity}</span>
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>

        <div className="mt-6 flex gap-6 justify-center items-center p-4 bg-gray-50 rounded-lg">
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
      </motion.div>
    </div>
  );
};

export default HeatmapView;
