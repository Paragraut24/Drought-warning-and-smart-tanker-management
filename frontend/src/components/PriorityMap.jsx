import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { villageAPI } from '../services/api';

const PriorityMap = () => {
  const [villages, setVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Maharashtra center coordinates
  const maharashtraCenter = {
    lat: 20.5937,
    lng: 78.9629
  };

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '12px'
  };

  const mapOptions = {
    zoom: 8,
    center: maharashtraCenter,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
  };

  useEffect(() => {
    loadVillages();
  }, []);

  const loadVillages = async () => {
    try {
      const response = await villageAPI.getWithPriority();
      setVillages(response.data);
    } catch (error) {
      console.error('Failed to load villages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerIcon = (category, priorityScore) => {
    // Create custom marker with color based on priority
    const colors = {
      critical: '#EF4444', // Red
      alert: '#F59E0B',    // Yellow/Orange
      normal: '#10B981'    // Green
    };

    const color = colors[category] || colors.normal;

    return {
      path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
      fillColor: color,
      fillOpacity: 0.9,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: priorityScore >= 75 ? 12 : priorityScore >= 35 ? 10 : 8,
    };
  };

  const getMarkerLabel = (village) => {
    return {
      text: village.name.substring(0, 3).toUpperCase(),
      color: '#FFFFFF',
      fontSize: '10px',
      fontWeight: 'bold'
    };
  };

  const getCategoryStats = () => {
    const critical = villages.filter(v => v.category === 'critical').length;
    const alert = villages.filter(v => v.category === 'alert').length;
    const normal = villages.filter(v => v.category === 'normal').length;
    return { critical, alert, normal };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Maharashtra map...</p>
        </div>
      </div>
    );
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="card p-8 text-center">
        <span className="text-6xl mb-4 block">🗺️</span>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Google Maps API Key Required</h3>
        <p className="text-gray-600 mb-4">
          To display the interactive map, please add your Google Maps API key to the .env file.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg text-left max-w-md mx-auto">
          <p className="text-sm font-mono text-gray-700">
            VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Get your free API key from: <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>
        </p>
      </div>
    );
  }

  const stats = getCategoryStats();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 bg-red-50 border-l-4 border-red-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Critical Priority</p>
              <p className="text-sm text-gray-500">Priority ≥ 75</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.critical}</p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🚨</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4 bg-yellow-50 border-l-4 border-yellow-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Alert Priority</p>
              <p className="text-sm text-gray-500">35 ≤ Priority &lt; 75</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.alert}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">⚠️</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4 bg-green-50 border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Normal Priority</p>
              <p className="text-sm text-gray-500">Priority &lt; 35</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.normal}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">✅</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-6"
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Maharashtra Villages Priority Map</h2>
          <p className="text-sm text-gray-600">महाराष्ट्र गांव प्राथमिकता मानचित्र - Color-coded by water priority</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center items-center p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white"></div>
            <span className="text-sm font-medium">Critical (≥75) - Immediate Action</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-500 rounded-full border-2 border-white"></div>
            <span className="text-sm font-medium">Alert (35-74) - Monitor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            <span className="text-sm font-medium">Normal (&lt;35) - Sufficient</span>
          </div>
        </div>

        {/* Google Map */}
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={maharashtraCenter}
            zoom={8}
            options={mapOptions}
          >
            {villages.map((village) => (
              <Marker
                key={village.id}
                position={{ lat: village.latitude, lng: village.longitude }}
                icon={getMarkerIcon(village.category, village.priorityScore)}
                onClick={() => setSelectedVillage(village)}
                title={`${village.name} - Priority: ${village.priorityScore}`}
              />
            ))}

            {selectedVillage && (
              <InfoWindow
                position={{
                  lat: selectedVillage.latitude,
                  lng: selectedVillage.longitude
                }}
                onCloseClick={() => setSelectedVillage(null)}
              >
                <div className="p-2 max-w-xs">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{selectedVillage.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      <span className="font-semibold">District:</span> {selectedVillage.district}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Population:</span> {selectedVillage.population.toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Storage:</span> {selectedVillage.storagePercent}%
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-semibold">Priority Score:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedVillage.category === 'critical' ? 'bg-red-500 text-white' :
                        selectedVillage.category === 'alert' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {selectedVillage.priorityScore}
                      </span>
                    </div>
                    <p className={`mt-2 font-semibold ${
                      selectedVillage.category === 'critical' ? 'text-red-600' :
                      selectedVillage.category === 'alert' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {selectedVillage.category === 'critical' ? '🚨 Immediate tanker allocation required' :
                       selectedVillage.category === 'alert' ? '⚠️ Monitor water levels closely' :
                       '✅ Water supply is sufficient'}
                    </p>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>

        {/* Info Note */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <span className="text-xl">💡</span>
            <div>
              <p className="font-semibold text-blue-800 mb-1">Interactive Priority Map</p>
              <p className="text-sm text-blue-700">
                Click on any marker to view detailed village information. Marker size and color indicate priority level:
                Larger red markers need immediate attention, medium yellow markers require monitoring, and smaller green markers have adequate water supply.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PriorityMap;
