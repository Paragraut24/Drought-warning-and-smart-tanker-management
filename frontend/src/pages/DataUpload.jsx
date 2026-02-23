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
    <div className="max-w-2xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white mb-8"
      >
        Data Upload
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="clay-card p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="clay-input w-full"
              required
            >
              <option value="">Select Village</option>
              {villages.map((v) => (
                <option key={v.id} value={v.id}>{v.name} - {v.district}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="clay-input w-full"
            >
              <option value="rainfall">Rainfall</option>
              <option value="groundwater">Groundwater</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.record_date}
              onChange={(e) => setFormData({ ...formData, record_date: e.target.value })}
              className="clay-input w-full"
              required
            />
          </div>

          {dataType === 'rainfall' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rainfall (mm)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.rainfall_mm}
                  onChange={(e) => setFormData({ ...formData, rainfall_mm: e.target.value })}
                  className="clay-input w-full"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_historical}
                  onChange={(e) => setFormData({ ...formData, is_historical: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Historical Data</label>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Water Level (m below ground)</label>
              <input
                type="number"
                step="0.01"
                value={formData.water_level}
                onChange={(e) => setFormData({ ...formData, water_level: e.target.value })}
                className="clay-input w-full"
                required
              />
            </div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 rounded-xl ${
                message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="clay-button w-full py-3 text-gray-700 font-semibold"
          >
            Upload Data
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default DataUpload;
