import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { analysisAPI, villageAPI, alertAPI } from '../services/api';
import TankerStatistics from '../components/TankerStatistics';
import LeafletPriorityMap from '../components/LeafletPriorityMap';

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

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading JalRakshak dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="hero-section relative text-white p-12 rounded-2xl overflow-hidden shadow-2xl">
        {/* Gradient Background with Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900">
          {/* Water wave pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="water-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="25" cy="25" r="2" fill="white" opacity="0.3"/>
                  <circle cx="75" cy="75" r="2" fill="white" opacity="0.3"/>
                  <circle cx="50" cy="50" r="3" fill="white" opacity="0.2"/>
                  <path d="M 0 50 Q 25 40, 50 50 T 100 50" stroke="white" strokeWidth="1" fill="none" opacity="0.2"/>
                  <path d="M 0 70 Q 25 60, 50 70 T 100 70" stroke="white" strokeWidth="1" fill="none" opacity="0.15"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#water-pattern)"/>
            </svg>
          </div>
          {/* Animated water drops effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4 mb-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
            >
              <span className="text-5xl">💧</span>
            </motion.div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-bold mb-2 drop-shadow-lg"
              >
                JalRakshak AI Dashboard
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl opacity-90 drop-shadow"
              >
                जल रक्षक - विदर्भ जल संकट प्रबंधन
              </motion.p>
            </div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl opacity-90 mb-6 drop-shadow"
          >
            Real-time water crisis monitoring for Vidarbha region
          </motion.p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-3 rounded-full border border-white/20 shadow-lg hover:bg-white/25 transition-all"
            >
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
              <span className="font-semibold">Live Monitoring Active</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-3 rounded-full border border-white/20 shadow-lg hover:bg-white/25 transition-all"
            >
              <span className="text-xl">🌡️</span>
              <span className="font-semibold">Drought Detection Enabled</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-3 rounded-full border border-white/20 shadow-lg hover:bg-white/25 transition-all"
            >
              <span className="text-xl">🤖</span>
              <span className="font-semibold">AI Predictions Running</span>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Wave separator */}
        <div className="hero-wave"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Villages', 
            sublabel: 'कुल गाँव',
            value: stats.total, 
            gradient: 'from-blue-500 to-blue-600', 
            icon: '🏘️',
            desc: 'Vidarbha Region'
          },
          { 
            label: 'Critical Status', 
            sublabel: 'गंभीर स्थिति',
            value: stats.critical, 
            gradient: 'from-red-500 to-red-600', 
            icon: '🚨',
            desc: 'Immediate Action'
          },
          { 
            label: 'Alert Status', 
            sublabel: 'चेतावनी',
            value: stats.alert, 
            gradient: 'from-yellow-500 to-yellow-600', 
            icon: '⚠️',
            desc: 'Monitor Closely'
          },
          { 
            label: 'Normal Status', 
            sublabel: 'सामान्य',
            value: stats.normal, 
            gradient: 'from-green-500 to-green-600', 
            icon: '✅',
            desc: 'Stable Supply'
          }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card p-6 overflow-hidden relative"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-16 -mt-16`}></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
                  <p className="text-gray-500 text-xs">{stat.sublabel}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1, type: 'spring' }}
                className="text-4xl font-bold text-gray-800 mb-1"
              >
                {stat.value}
              </motion.p>
              <p className="text-xs text-gray-500">{stat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Stress Index Trend - Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Water Stress Index</h2>
              <p className="text-sm text-gray-500">जल तनाव सूचकांक - Critical Villages Trend</p>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
              High Risk
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={wsiData.slice(0, 8)}>
              <defs>
                <linearGradient id="colorWSI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="villageName" 
                stroke="#64748b" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="wsi" 
                stroke="#ef4444" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorWSI)" 
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Higher values indicate severe water stress requiring immediate intervention
          </p>
        </motion.div>

        {/* Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Status Distribution</h2>
            <p className="text-sm text-gray-500">स्थिति वितरण - Regional Overview</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Critical (गंभीर)', value: stats.critical },
                  { name: 'Alert (चेतावनी)', value: stats.alert },
                  { name: 'Normal (सामान्य)', value: stats.normal }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-red-50 rounded">
              <p className="font-bold text-red-600">{stats.critical}</p>
              <p className="text-gray-600">Need Tankers</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded">
              <p className="font-bold text-yellow-600">{stats.alert}</p>
              <p className="text-gray-600">Watch List</p>
            </div>
            <div className="p-2 bg-green-50 rounded">
              <p className="font-bold text-green-600">{stats.normal}</p>
              <p className="text-gray-600">Sufficient</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Active Alerts</h2>
            <p className="text-sm text-gray-500">सक्रिय अलर्ट - Immediate Attention Required</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
            {alerts.length} Active
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alerts.slice(0, 6).map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl border-l-4 ${
                alert.severity === 'critical' 
                  ? 'bg-red-50 border-red-500' 
                  : alert.severity === 'alert' 
                  ? 'bg-yellow-50 border-yellow-500' 
                  : 'bg-green-50 border-green-500'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-gray-800">{alert.Village?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{alert.Village?.district || 'Vidarbha'}</p>
                </div>
                <span className="text-2xl">
                  {alert.severity === 'critical' ? '🚨' : alert.severity === 'alert' ? '⚠️' : '✅'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {new Date(alert.createdAt).toLocaleDateString('en-IN')}
                </span>
                <span className={`px-2 py-1 rounded ${
                  alert.severity === 'critical' ? 'bg-red-200 text-red-800' : 
                  alert.severity === 'alert' ? 'bg-yellow-200 text-yellow-800' : 
                  'bg-green-200 text-green-800'
                }`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        {alerts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">✅</p>
            <p className="text-lg font-semibold">No Active Alerts</p>
            <p className="text-sm">All villages have sufficient water supply</p>
          </div>
        )}
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl"
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl">💡</span>
          <div>
            <h3 className="font-bold text-lg mb-1">JalRakshak AI - Powered by Machine Learning</h3>
            <p className="text-sm opacity-90">
              Using advanced algorithms to predict water demand, optimize tanker routes, and prevent water crises in Vidarbha region. 
              Real-time monitoring of {stats.total} villages with AI-driven drought detection.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tanker Statistics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Tanker Deployment Status</h2>
          <p className="text-sm text-gray-500">टैंकर तैनाती स्थिति - Real-time Tracking</p>
        </div>
        <TankerStatistics />
      </motion.div>

      {/* Priority Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <LeafletPriorityMap />
      </motion.div>
    </div>
  );
};

export default Dashboard;
