import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/upload', label: 'Data Upload', icon: '📤' },
    { path: '/heatmap', label: 'Heatmap', icon: '🗺️' },
    { path: '/allocation', label: 'Allocation', icon: '🚚' },
    { path: '/routes', label: 'Routes', icon: '🛣️' },
    { path: '/alerts', label: 'Alerts', icon: '🔔' }
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-white/20 backdrop-blur-lg p-6 shadow-clay"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">💧 Water Gov</h1>
        <p className="text-sm text-white/80">Intelligence Platform</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-white/30 shadow-clay'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="text-white font-medium">{item.label}</span>
            </motion.div>
          </Link>
        ))}
      </nav>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLogout}
        className="mt-8 w-full p-3 bg-red-500/80 text-white rounded-xl shadow-clay hover:bg-red-600/80"
      >
        Logout
      </motion.button>
    </motion.div>
  );
};

export default Sidebar;
