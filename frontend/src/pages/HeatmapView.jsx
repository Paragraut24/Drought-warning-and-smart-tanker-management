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
    borderRadius: '20px'
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
    return <div className="text-white text-center">Loading map...</div>;
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white mb-8"
      >
        Water Stress Heatmap
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="clay-card p-6"
      >
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={6}
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
                  <h3 className="font-bold">{selectedVillage.villageName}</h3>
                  <p>WSI: {selectedVillage.wsi}</p>
                  <p className="capitalize">Severity: {selectedVillage.severity}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>

        <div className="mt-6 flex gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Alert</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm">Critical</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeatmapView;
