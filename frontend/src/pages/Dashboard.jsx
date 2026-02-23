import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analysisAPI, villageAPI, alertAPI } from '../services/api';

const Dashboard = () => {
  const [wsiData, setWsiData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ total: 0, critical: 0, alert: 0, normal: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [wsiRes, alertRes] = await Promise.all([
        analysisAPI.getAllWSI(),
        alertAPI.getActive()
      ]);

      setWsiData(wsiRes.data);
      setAlerts(alertRes.data);

      const critical = wsiRes.data.filter(v => v.severity === 'critical').length;
      const alert = wsiRes.data.filter(v => v.severity === 'alert').length;
      const normal = wsiRes.data.filter(v => v.severity === 'normal').length;

      setStats({ total: wsiRes.data.length, critical, alert, normal });
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white mb-8"
      >
        Dashboard Overview
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Villages', value: stats.total, color: 'bg-blue-500', icon: '🏘️' },
          { label: 'Critical', value: stats.critical, color: 'bg-red-500', icon: '🚨' },
          { label: 'Alert', value: stats.alert, color: 'bg-yellow-500', icon: '⚠️' },
          { label: 'Normal', value: stats.normal, color: 'bg-green-500', icon: '✅' }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="clay-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="text-3xl font-bold text-gray-800"
                >
                  {stat.value}
                </motion.p>
              </div>
              <div className={`${stat.color} p-4 rounded-xl text-3xl`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="clay-card p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Critical Villages</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wsiData.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="villageName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="wsi" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="clay-card p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Active Alerts</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {alerts.slice(0, 5).map((alert) => (
              <motion.div
                key={alert.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl ${
                  alert.severity === 'critical' ? 'bg-red-100' :
                  alert.severity === 'alert' ? 'bg-yellow-100' : 'bg-green-100'
                }`}
              >
                <p className="font-semibold">{alert.Village?.name}</p>
                <p className="text-sm text-gray-600">{alert.message}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
