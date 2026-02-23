import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tankerAPI } from '../services/api';

const TankerStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
    // Refresh every 30 seconds
    const interval = setInterval(loadStatistics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await tankerAPI.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('Failed to load tanker statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>Unable to load tanker statistics</p>
      </div>
    );
  }

  const { summary, recentAllocations, criticalAllocations } = statistics;

  const statCards = [
    {
      label: 'Total Tankers Sent',
      sublabel: 'कुल टैंकर भेजे गए',
      value: summary.totalSent,
      icon: '🚚',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Delivered',
      sublabel: 'वितरित',
      value: summary.delivered,
      icon: '✅',
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'In Progress',
      sublabel: 'प्रगति में',
      value: summary.inProgress,
      icon: '🔄',
      gradient: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Pending',
      sublabel: 'लंबित',
      value: summary.pending,
      icon: '⏳',
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-orange-100 text-orange-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      in_progress: '🔄',
      completed: '✅',
      cancelled: '❌'
    };
    return icons[status] || '❓';
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`card p-6 overflow-hidden relative ${stat.bgColor}`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-12 -mt-12`}></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-gray-700 text-sm font-semibold">{stat.label}</p>
                  <p className="text-gray-500 text-xs">{stat.sublabel}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1, type: 'spring' }}
                className="text-4xl font-bold text-gray-800"
              >
                {stat.value}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Critical Area Allocations */}
      {criticalAllocations && criticalAllocations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Critical Area Tankers</h3>
              <p className="text-sm text-gray-500">गंभीर क्षेत्र टैंकर - Active Deliveries</p>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
              {criticalAllocations.length} Active
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Village</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tanker</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Capacity</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {criticalAllocations.map((allocation, idx) => (
                  <motion.tr
                    key={allocation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-gray-800">{allocation.Village?.name}</p>
                        <p className="text-xs text-gray-500">{allocation.Village?.district}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {allocation.Tanker?.registration_number}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {allocation.Tanker?.capacity.toLocaleString()} L
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(allocation.status)}`}>
                        {getStatusIcon(allocation.status)} {allocation.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(allocation.allocation_date).toLocaleDateString('en-IN')}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Recent Allocations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">Recent Tanker Allocations</h3>
          <p className="text-sm text-gray-500">हाल के टैंकर आवंटन - Last 10 Deliveries</p>
        </div>
        <div className="space-y-3">
          {recentAllocations.map((allocation, idx) => (
            <motion.div
              key={allocation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{getStatusIcon(allocation.status)}</span>
                <div>
                  <p className="font-semibold text-gray-800">{allocation.Village?.name}</p>
                  <p className="text-sm text-gray-600">
                    {allocation.Tanker?.registration_number} • {allocation.Tanker?.capacity.toLocaleString()} L
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(allocation.status)}`}>
                  {allocation.status.replace('_', ' ').toUpperCase()}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(allocation.allocation_date).toLocaleDateString('en-IN')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TankerStatistics;
