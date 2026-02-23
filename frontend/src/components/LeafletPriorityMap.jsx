import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { villageAPI } from '../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LeafletPriorityMap = () => {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Maharashtra center coordinates
  const maharashtraCenter = [20.5937, 78.9629];

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

  // Create custom marker icons based on priority
  const createCustomIcon = (category, priorityScore) => {
    const colors = {
      critical: '#EF4444', // Red
      alert: '#F59E0B',    // Yellow/Orange
      normal: '#10B981'    // Green
    };

    const color = colors[category] || colors.normal;
    const size = priorityScore >= 75 ? 40 : priorityScore >= 35 ? 32 : 24;

    const svgIcon = `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
        <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">
          ${priorityScore >= 75 ? '🚨' : priorityScore >= 35 ? '⚠️' : '✅'}
        </text>
      </svg>
    `;

    return L.divIcon({
      html: svgIcon,
      className: 'custom-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2]
    });
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

        {/* Leaflet Map */}
        <div style={{ height: '600px', borderRadius: '12px', overflow: 'hidden' }}>
          <MapContainer
            center={maharashtraCenter}
            zoom={8}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {villages.map((village) => (
              <Marker
                key={village.id}
                position={[village.latitude, village.longitude]}
                icon={createCustomIcon(village.category, village.priorityScore)}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{village.name}</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        <span className="font-semibold">District:</span> {village.district}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Population:</span> {village.population.toLocaleString()}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Storage:</span> {village.storagePercent}%
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-semibold">Priority Score:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          village.category === 'critical' ? 'bg-red-500 text-white' :
                          village.category === 'alert' ? 'bg-yellow-500 text-white' :
                          'bg-green-500 text-white'
                        }`}>
                          {village.priorityScore}
                        </span>
                      </div>
                      <p className={`mt-2 font-semibold text-xs ${
                        village.category === 'critical' ? 'text-red-600' :
                        village.category === 'alert' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {village.category === 'critical' ? '🚨 Immediate tanker allocation required' :
                         village.category === 'alert' ? '⚠️ Monitor water levels closely' :
                         '✅ Water supply is sufficient'}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Info Note */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <span className="text-xl">💡</span>
            <div>
              <p className="font-semibold text-blue-800 mb-1">Interactive Priority Map - Powered by OpenStreetMap</p>
              <p className="text-sm text-blue-700">
                Click on any marker to view detailed village information. Marker size and color indicate priority level:
                Larger red markers need immediate attention, medium yellow markers require monitoring, and smaller green markers have adequate water supply.
                <strong> No API key required - completely free!</strong>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeafletPriorityMap;
