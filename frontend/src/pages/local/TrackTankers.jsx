import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { tankerAPI } from '../../services/api';

const TrackTankers = () => {
    const { user } = useAuth();
    const [allocations, setAllocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadAllocations();
    }, []);

    const loadAllocations = async () => {
        try {
            const res = await tankerAPI.getMyVillage();
            setAllocations(res.data);
        } catch (err) {
            console.error('Failed to load allocations:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700',
            in_progress: 'bg-blue-100 text-blue-700',
            completed: 'bg-green-100 text-green-700',
            cancelled: 'bg-gray-100 text-gray-600'
        };
        const icons = {
            pending: '⏳',
            in_progress: '🚛',
            completed: '✅',
            cancelled: '❌'
        };
        return (
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${styles[status] || styles.pending}`}>
                {icons[status] || '⏳'} {status?.replace('_', ' ')}
            </span>
        );
    };

    const filteredAllocations = filter === 'all'
        ? allocations
        : allocations.filter(a => a.status === filter);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">🚛 Track Tankers</h1>
                <p className="text-gray-600 mb-6">
                    Tanker deliveries for {user?.village?.name}, {user?.village?.district}
                </p>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {['all', 'pending', 'in_progress', 'completed'].map((f) => {
                    const count = f === 'all' ? allocations.length : allocations.filter(a => a.status === f).length;
                    const labels = { all: 'Total', pending: 'Pending', in_progress: 'In Transit', completed: 'Delivered' };
                    const colors = { all: 'bg-gray-100', pending: 'bg-yellow-50', in_progress: 'bg-blue-50', completed: 'bg-green-50' };
                    return (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`p-4 rounded-xl text-center transition-all ${filter === f ? 'ring-2 ring-green-500 shadow-md' : ''
                                } ${colors[f]}`}
                        >
                            <div className="text-2xl font-bold text-gray-800">{count}</div>
                            <div className="text-xs text-gray-600 font-medium">{labels[f]}</div>
                        </button>
                    );
                })}
            </div>

            {/* Allocations List */}
            <div className="space-y-4">
                {filteredAllocations.length > 0 ? (
                    filteredAllocations.map((alloc, i) => (
                        <motion.div
                            key={alloc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="card p-5"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">🚛</span>
                                        <div>
                                            <p className="font-bold text-gray-800">
                                                {alloc.Tanker?.registration_number || `Tanker #${alloc.tanker_id}`}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Capacity: {alloc.Tanker?.capacity ? Number(alloc.Tanker.capacity).toLocaleString() + 'L' : '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end gap-2">
                                    {getStatusBadge(alloc.status)}
                                    <p className="text-xs text-gray-500">
                                        Allocated: {new Date(alloc.allocation_date).toLocaleDateString()}
                                    </p>
                                    {alloc.estimated_delivery && (
                                        <p className="text-xs text-gray-500">
                                            ETA: {new Date(alloc.estimated_delivery).toLocaleDateString()}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        Priority Score: {Number(alloc.priority_score).toFixed(1)}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        <span className="text-6xl block mb-4">🚛</span>
                        <p className="text-lg font-medium">No tanker allocations found</p>
                        <p className="text-sm">Tankers will appear here once allocated to your village</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackTankers;
