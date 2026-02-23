import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { villageAPI, alertAPI, tankerAPI, analysisAPI } from '../../services/api';

const LocalDashboard = () => {
    const { user } = useAuth();
    const [villageData, setVillageData] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [wsi, setWsi] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [villageRes, alertsRes, allocationRes] = await Promise.all([
                villageAPI.getById(user.village_id),
                alertAPI.getMyVillage(),
                tankerAPI.getMyVillage()
            ]);
            setVillageData(villageRes.data);
            setAlerts(alertsRes.data);
            setAllocations(allocationRes.data);

            // Try to load WSI data
            try {
                const wsiRes = await analysisAPI.getWSI(user.village_id);
                setWsi(wsiRes.data);
            } catch {
                // WSI might not be available
            }
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStoragePercentage = () => {
        if (!villageData) return 0;
        return Math.round((villageData.current_storage / villageData.storage_capacity) * 100);
    };

    const getStorageColor = () => {
        const pct = getStoragePercentage();
        if (pct < 30) return 'from-red-500 to-red-600';
        if (pct < 50) return 'from-orange-500 to-yellow-500';
        return 'from-green-500 to-emerald-500';
    };

    const getStorageTextColor = () => {
        const pct = getStoragePercentage();
        if (pct < 30) return 'text-red-600';
        if (pct < 50) return 'text-orange-600';
        return 'text-green-600';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const activeAlerts = alerts.filter(a => !a.is_resolved);
    const activeDeliveries = allocations.filter(a => a.status === 'pending' || a.status === 'in_progress');

    return (
        <div className="max-w-6xl mx-auto">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome, {user?.username} 👋
                </h1>
                <p className="text-gray-600 mt-1">
                    📍 {user?.village?.name}, {user?.village?.district} — Here's your village water status
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-6"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">💧</span>
                        <span className={`text-2xl font-bold ${getStorageTextColor()}`}>
                            {getStoragePercentage()}%
                        </span>
                    </div>
                    <h3 className="font-semibold text-gray-800">Water Storage</h3>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full bg-gradient-to-r ${getStorageColor()}`}
                            style={{ width: `${getStoragePercentage()}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {villageData ? `${Number(villageData.current_storage).toLocaleString()}L / ${Number(villageData.storage_capacity).toLocaleString()}L` : '—'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-6"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">⚠️</span>
                        <span className={`text-2xl font-bold ${activeAlerts.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {activeAlerts.length}
                        </span>
                    </div>
                    <h3 className="font-semibold text-gray-800">Active Alerts</h3>
                    <p className="text-xs text-gray-500 mt-2">
                        {activeAlerts.length > 0
                            ? `${activeAlerts.filter(a => a.severity === 'critical').length} critical`
                            : 'No active alerts'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card p-6"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">🚛</span>
                        <span className="text-2xl font-bold text-blue-600">{activeDeliveries.length}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">Active Deliveries</h3>
                    <p className="text-xs text-gray-500 mt-2">
                        {activeDeliveries.length > 0 ? 'Tankers heading your way' : 'No pending deliveries'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card p-6"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">👥</span>
                        <span className="text-2xl font-bold text-purple-600">
                            {villageData?.population?.toLocaleString() || '—'}
                        </span>
                    </div>
                    <h3 className="font-semibold text-gray-800">Population</h3>
                    <p className="text-xs text-gray-500 mt-2">Residents in your village</p>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link to="/local/report">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="card p-6 cursor-pointer border-2 border-transparent hover:border-green-200"
                    >
                        <span className="text-4xl block mb-3">📝</span>
                        <h3 className="font-bold text-gray-800 text-lg">Report Shortage</h3>
                        <p className="text-sm text-gray-600 mt-1">Submit a water shortage report for your village</p>
                    </motion.div>
                </Link>

                <Link to="/local/tankers">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="card p-6 cursor-pointer border-2 border-transparent hover:border-blue-200"
                    >
                        <span className="text-4xl block mb-3">🚛</span>
                        <h3 className="font-bold text-gray-800 text-lg">Track Tankers</h3>
                        <p className="text-sm text-gray-600 mt-1">View tanker deliveries assigned to your village</p>
                    </motion.div>
                </Link>

                <Link to="/local/village">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="card p-6 cursor-pointer border-2 border-transparent hover:border-purple-200"
                    >
                        <span className="text-4xl block mb-3">📊</span>
                        <h3 className="font-bold text-gray-800 text-lg">Village Data</h3>
                        <p className="text-sm text-gray-600 mt-1">View rainfall, groundwater, and WSI data</p>
                    </motion.div>
                </Link>
            </div>

            {/* Recent Alerts */}
            {activeAlerts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4">🔔 Recent Alerts</h2>
                    <div className="space-y-3">
                        {activeAlerts.slice(0, 3).map(alert => (
                            <div
                                key={alert.id}
                                className={`p-4 rounded-lg border-l-4 ${alert.severity === 'critical'
                                        ? 'bg-red-50 border-red-500'
                                        : alert.severity === 'alert'
                                            ? 'bg-orange-50 border-orange-500'
                                            : 'bg-yellow-50 border-yellow-500'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${alert.severity === 'critical' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
                                        }`}>
                                        {alert.severity}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(alert.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mt-2">{alert.message}</p>
                            </div>
                        ))}
                    </div>
                    {activeAlerts.length > 3 && (
                        <Link to="/local/alerts" className="text-green-600 font-semibold text-sm mt-3 inline-block hover:underline">
                            View all alerts →
                        </Link>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default LocalDashboard;
