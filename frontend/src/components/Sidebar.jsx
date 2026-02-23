import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: '📊', label: 'Dashboard', desc: 'Overview' },
    { path: '/upload', icon: '📤', label: 'Data Upload', desc: 'Add Records' },
    { path: '/heatmap', icon: '🗺️', label: 'Heatmap', desc: 'Regional View' },
    { path: '/allocation', icon: '🚰', label: 'Allocation', desc: 'Water Supply' },
    { path: '/routes', icon: '🚛', label: 'Routes', desc: 'Optimization' },
    { path: '/alerts', icon: '🔔', label: 'Alerts', desc: 'Notifications' },
  ];

  return (
    <div className="sidebar-nav w-64 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">💧</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">JalRakshak AI</h1>
            <p className="text-xs text-gray-500">जल रक्षक</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">Vidarbha Water Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item flex items-center gap-3 ${isActive ? 'active' : 'text-gray-700'}`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-75">{item.desc}</div>
              </div>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-800">
            {JSON.parse(localStorage.getItem('user') || '{}').username || 'Admin'}
          </p>
          <p className="text-xs text-gray-500">
            {JSON.parse(localStorage.getItem('user') || '{}').role || 'Administrator'}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
        >
          Logout
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;
