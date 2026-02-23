import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { villageAPI, dataAPI } from '../services/api';

const DataUpload = () => {
  const [villages, setVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState('');
  const [dataType, setDataType] = useState('rainfall');
  const [formData, setFormData] = useState({
    rainfall_mm: '',
    water_level: '',
    record_date: new Date().toISOString().split('T')[0],
    is_historical: false
  });
  const [message, setMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const data = {
        village_id: parseInt(selectedVillage),
        record_date: formData.record_date,
        ...(dataType === 'rainfall' 
          ? { rainfall_mm: parseFloat(formData.rainfall_mm), is_historical: formData.is_historical }
          : { water_level: parseFloat(formData.water_level) }
        )
      };

      if (dataType === 'rainfall') {
        await dataAPI.addRainfall(data);
      } else {
        await dataAPI.addGroundwater(data);
      }

      setMessage('Data uploaded successfully!');
      setFormData({
        rainfall_mm: '',
        water_level: '',
        record_date: new Date().toISOString().split('T')[0],
        is_historical: false
      });
    } catch (error) {
      setMessage('Upload failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Data Upload</h1>
        <p className="text-gray-600">डेटा अपलोड - Add rainfall and groundwater records for Vidarbha villages</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100"
        >
          <div className="text-4xl mb-3">🌧️</div>
          <h3 className="font-bold text-gray-800 mb-2">Rainfall Data</h3>
          <p className="text-sm text-gray-600">Upload daily rainfall measurements in millimeters</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 bg-gradient-to-br from-green-50 to-green-100"
        >
          <div className="text-4xl mb-3">💧</div>
          <h3 className="font-bold text-gray-800 mb-2">Groundwater Level</h3>
          <p className="text-sm text-gray-600">Record water table depth below ground surface</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100"
        >
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-bold text-gray-800 mb-2">AI Analysis</h3>
          <p className="text-sm text-gray-600">Data automatically analyzed for drought prediction</p>
        </motion.div>
      </div>

      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-8 mt-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload New Record</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Village <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select Village</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} - {v.district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Data Type <span className="text-red-500">*</span>
              </label>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
                className="input-field"
              >
                <option value="rainfall">Rainfall</option>
                <option value="groundwater">Groundwater</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.record_date}
              onChange={(e) => setFormData({ ...formData, record_date: e.target.value })}
              className="input-field"
              required
            />
          </div>

          {dataType === 'rainfall' ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rainfall (mm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.rainfall_mm}
                  onChange={(e) => setFormData({ ...formData, rainfall_mm: e.target.value })}
                  className="input-field"
                  placeholder="Enter rainfall in millimeters"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Example: 25.5 mm</p>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.is_historical}
                  onChange={(e) => setFormData({ ...formData, is_historical: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                  id="historical"
                />
                <label htmlFor="historical" className="ml-3 text-sm text-gray-700">
                  <span className="font-semibold">Historical Data</span>
                  <p className="text-xs text-gray-500">Check if this is past data for baseline comparison</p>
                </label>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Water Level (meters below ground) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.water_level}
                onChange={(e) => setFormData({ ...formData, water_level: e.target.value })}
                className="input-field"
                placeholder="Enter depth in meters"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Example: 15.5 meters (deeper = worse)</p>
            </div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border-l-4 ${
                message.includes('success') 
                  ? 'bg-green-50 border-green-500 text-green-700' 
                  : 'bg-red-50 border-red-500 text-red-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{message.includes('success') ? '✅' : '❌'}</span>
                <span className="font-semibold">{message}</span>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary w-full py-3"
          >
            Upload Data
          </motion.button>
        </form>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200"
      >
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>💡</span>
          <span>Data Collection Guidelines</span>
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Rainfall should be measured daily using standard rain gauges</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Groundwater levels should be measured from bore wells or observation wells</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Historical data helps establish baseline for drought detection</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>Regular data updates improve AI prediction accuracy</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default DataUpload;
