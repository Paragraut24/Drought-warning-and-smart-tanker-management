import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { alertAPI } from '../../services/api';

const MyAlerts = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        try {
            const res = await alertAPI.getMyVillage();
            setAlerts(res.data);
        } catch (err) {
            console.error('Failed to load alerts:', err);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityStyle = (severity) => {
        return {
            critical: { bg: 'bg-red-50', border: 'border-red-500', badge: 'bg-red-200 text-red-800', icon: '🔴' },
            alert: { bg: 'bg-orange-50', border: 'border-orange-500', badge: 'bg-orange-200 text-orange-800', icon: '🟠' },
            normal: { bg: 'bg-green-50', border: 'border-green-500', badge: 'bg-green-200 text-green-800', icon: '🟢' }
        }[severity] || { bg: 'bg-gray-50', border: 'border-gray-300', badge: 'bg-gray-200 text-gray-700', icon: '⚪' };
    };

    const filteredAlerts = filter === 'all'
        ? alerts
        : filter === 'active'
            ? alerts.filter(a => !a.is_resolved)
            : alerts.filter(a => a.is_resolved);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const activeCount = alerts.filter(a => !a.is_resolved).length;
    const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.is_resolved).length;

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">🔔 Alerts & Notifications</h1>
                <p className="text-gray-600 mb-6">
                    Drought alerts for {user?.village?.name}, {user?.village?.district}
                </p>
            </motion.div>

            {/* Summary Bar */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-4 text-center"
                >
                    <div className="text-2xl font-bold text-gray-800">{alerts.length}</div>
                    <div className="text-xs text-gray-600">Total Alerts</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-4 text-center"
                >
                    <div className={`text-2xl font-bold ${activeCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>{activeCount}</div>
                    <div className="text-xs text-gray-600">Active</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-4 text-center"
                >
                    <div className={`text-2xl font-bold ${criticalCount > 0 ? 'text-red-600' : 'text-green-600'}`}>{criticalCount}</div>
                    <div className="text-xs text-gray-600">Critical</div>
                </motion.div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                {['all', 'active', 'resolved'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f
                                ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Alerts List */}
            {filteredAlerts.length > 0 ? (
                <div className="space-y-4">
                    {filteredAlerts.map((alert, i) => {
                        const style = getSeverityStyle(alert.severity);
                        return (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`p-5 rounded-xl border-l-4 ${style.bg} ${style.border} ${alert.is_resolved ? 'opacity-60' : ''}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${style.badge}`}>
                                                {style.icon} {alert.severity}
                                            </span>
                                            {alert.is_resolved && (
                                                <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-600">
                                                    ✅ Resolved
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-800">{alert.message}</p>
                                        {alert.wsi_score && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                WSI Score: {Number(alert.wsi_score).toFixed(1)}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            {new Date(alert.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(alert.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500">
                    <span className="text-6xl block mb-4">🔕</span>
                    <p className="text-lg font-medium">No alerts found</p>
                    <p className="text-sm">
                        {filter === 'active' ? 'No active alerts for your village — great news!' : 'No alerts matching this filter'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default MyAlerts;
