import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { reportAPI } from '../../services/api';

const ReportShortage = () => {
    const { user } = useAuth();
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState('medium');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const res = await reportAPI.getMyReports();
            setReports(res.data);
        } catch (err) {
            console.error('Failed to load reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await reportAPI.submit({ description, severity });
            setSuccess('Report submitted successfully! The admin team will review it.');
            setDescription('');
            setSeverity('medium');
            loadReports();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit report');
        } finally {
            setSubmitting(false);
        }
    };

    const getSeverityColor = (sev) => {
        return {
            low: 'bg-green-100 text-green-700',
            medium: 'bg-orange-100 text-orange-700',
            high: 'bg-red-100 text-red-700'
        }[sev] || 'bg-gray-100 text-gray-700';
    };

    const getStatusColor = (status) => {
        return {
            pending: 'bg-yellow-100 text-yellow-700',
            acknowledged: 'bg-blue-100 text-blue-700',
            resolved: 'bg-green-100 text-green-700'
        }[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">📝 Report Water Shortage</h1>
                <p className="text-gray-600 mb-6">
                    Submit a report for {user?.village?.name}, {user?.village?.district}
                </p>
            </motion.div>

            {/* Report Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 mb-8"
            >
                <h2 className="font-bold text-gray-800 text-lg mb-4">New Report</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Severity Level
                        </label>
                        <div className="flex gap-3">
                            {['low', 'medium', 'high'].map(s => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSeverity(s)}
                                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold capitalize transition-all border-2 ${severity === s
                                            ? s === 'low' ? 'border-green-500 bg-green-50 text-green-700'
                                                : s === 'medium' ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                    : 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {s === 'low' ? '🟢' : s === 'medium' ? '🟠' : '🔴'} {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input-field min-h-[120px] resize-y"
                            placeholder="Describe the water shortage situation in your village (e.g., taps are dry for the past 2 days, borewell water level has dropped significantly, etc.)"
                            required
                        />
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm"
                            >
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-teal-600 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                    >
                        {submitting ? 'Submitting...' : 'Submit Report'}
                    </motion.button>
                </form>
            </motion.div>

            {/* Past Reports */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="font-bold text-gray-800 text-lg mb-4">📋 My Past Reports</h2>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : reports.length > 0 ? (
                    <div className="space-y-3">
                        {reports.map((report, i) => (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="card p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="text-gray-800 text-sm">{report.description}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {new Date(report.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getSeverityColor(report.severity)}`}>
                                            {report.severity}
                                        </span>
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(report.status)}`}>
                                            {report.status}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <span className="text-5xl block mb-3">📝</span>
                        <p className="font-medium">No reports submitted yet</p>
                        <p className="text-sm">Use the form above to submit your first report</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ReportShortage;
