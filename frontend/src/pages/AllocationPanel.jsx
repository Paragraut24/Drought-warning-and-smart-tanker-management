import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tankerAPI } from '../services/api';

const AllocationPanel = () => {
  const [allocations, setAllocations] = useState([]);
  const [tankers, setTankers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setPageLoading(true);
      const [allocRes, tankerRes] = await Promise.all([
        tankerAPI.getAllocations(),
        tankerAPI.getAll()
      ]);
      
      // Ensure data is valid
      const validAllocations = (allocRes.data || []).map(alloc => ({
        ...alloc,
        priority_score: alloc.priority_score ? parseFloat(alloc.priority_score) : 0,
        status: alloc.status || 'pending',
        createdAt: alloc.createdAt || new Date().toISOString()
      }));
      
      setAllocations(validAllocations);
      setTankers(tankerRes.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      setAllocations([]);
      setTankers([]);
    } finally {
      setPageLoading(false);
    }
  };

  const handleAllocate = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await tankerAPI.allocate();
      setMessage(response.data.message || '✅ Tankers allocated successfully!');
      await loadData();
    } catch (error) {
      console.error('Allocation error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Allocation failed';
      setMessage(`❌ Allocation failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Loading State */}
      {pageLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading allocation data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Water Tanker Allocation</h1>
            <p className="text-gray-600">पानी टैंकर आवंटन - AI-powered smart allocation for critical villages</p>
          </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Tankers</p>
              <p className="text-3xl font-bold text-blue-600">{tankers.length}</p>
            </div>
            <span className="text-4xl">🚛</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card p-6 bg-gradient-to-br from-green-50 to-green-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Available</p>
              <p className="text-3xl font-bold text-green-600">
                {tankers.filter(t => t.status === 'available').length}
              </p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Active Allocations</p>
              <p className="text-3xl font-bold text-purple-600">{allocations.length}</p>
            </div>
            <span className="text-4xl">📍</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card p-6 bg-gradient-to-br from-yellow-50 to-yellow-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600">
                {allocations.filter(a => a.status === 'in_progress').length}
              </p>
            </div>
            <span className="text-4xl">⏳</span>
          </div>
        </motion.div>
      </div>

      {/* Allocation Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Smart Allocation System</h2>
            <p className="text-gray-600">AI analyzes water stress levels and automatically assigns tankers to critical villages</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAllocate}
            disabled={loading}
            className="btn-primary px-8 py-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Allocating...
              </span>
            ) : (
              '🤖 Run Smart Allocation'
            )}
          </motion.button>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg border-l-4 ${
              message.includes('success') || message.includes('allocated')
                ? 'bg-green-50 border-green-500 text-green-700'
                : 'bg-blue-50 border-blue-500 text-blue-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">✓</span>
              <span className="font-semibold">{message}</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Allocations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Allocations</h2>
        
        {allocations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-700">Village</th>
                  <th className="text-left p-4 font-semibold text-gray-700">District</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Tanker</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Priority</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Allocated</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((alloc, idx) => (
                  <motion.tr
                    key={alloc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-800">{alloc.Village?.name || 'N/A'}</td>
                    <td className="p-4 text-gray-600">{alloc.Village?.district || 'N/A'}</td>
                    <td className="p-4 text-gray-600">{alloc.Tanker?.registration_number || 'N/A'}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        {alloc.priority_score ? parseFloat(alloc.priority_score).toFixed(1) : 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        alloc.status === 'completed' ? 'bg-green-100 text-green-700' :
                        alloc.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {alloc.status ? alloc.status.replace('_', ' ').toUpperCase() : 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {alloc.createdAt ? new Date(alloc.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-xl font-semibold text-gray-800 mb-2">No Active Allocations</p>
            <p className="text-gray-600">Click "Run Smart Allocation" to assign tankers to critical villages</p>
          </div>
        )}
      </motion.div>
        </>
      )}
    </div>
  );
};

export default AllocationPanel;
