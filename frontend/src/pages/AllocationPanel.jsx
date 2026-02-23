import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tankerAPI } from '../services/api';

const AllocationPanel = () => {
  const [allocations, setAllocations] = useState([]);
  const [tankers, setTankers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [allocRes, tankerRes] = await Promise.all([
        tankerAPI.getAllocations(),
        tankerAPI.getAll()
      ]);
      setAllocations(allocRes.data);
      setTankers(tankerRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleAllocate = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await tankerAPI.allocate();
      setMessage(response.data.message);
      loadData();
    } catch (error) {
      setMessage('Allocation failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white mb-8"
      >
        Tanker Allocation
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="clay-card p-6"
        >
          <p className="text-gray-600 text-sm">Total Tankers</p>
          <p className="text-3xl font-bold text-gray-800">{tankers.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="clay-card p-6"
        >
          <p className="text-gray-600 text-sm">Available</p>
          <p className="text-3xl font-bold text-green-600">
            {tankers.filter(t => t.status === 'available').length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="clay-card p-6"
        >
          <p className="text-gray-600 text-sm">Active Allocations</p>
          <p className="text-3xl font-bold text-blue-600">{allocations.length}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="clay-card p-6 mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAllocate}
          disabled={loading}
          className="clay-button px-8 py-3 text-gray-700 font-semibold"
        >
          {loading ? 'Allocating...' : 'Run Smart Allocation'}
        </motion.button>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-xl"
          >
            {message}
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="clay-card p-6"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Current Allocations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Village</th>
                <th className="text-left p-3">Tanker</th>
                <th className="text-left p-3">Priority</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((alloc) => (
                <motion.tr
                  key={alloc.id}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  className="border-b"
                >
                  <td className="p-3">{alloc.Village?.name}</td>
                  <td className="p-3">{alloc.Tanker?.registration_number}</td>
                  <td className="p-3">{alloc.priority_score}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      alloc.status === 'completed' ? 'bg-green-100 text-green-700' :
                      alloc.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {alloc.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AllocationPanel;
