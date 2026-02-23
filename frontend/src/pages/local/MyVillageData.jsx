import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { villageAPI, dataAPI, analysisAPI } from '../../services/api';

const MyVillageData = () => {
    const { user } = useAuth();
    const [village, setVillage] = useState(null);
    const [rainfall, setRainfall] = useState([]);
    const [groundwater, setGroundwater] = useState([]);
    const [wsi, setWsi] = useState(null);
    const [drought, setDrought] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const vid = user.village_id;
            const [villageRes, rainfallRes, gwRes] = await Promise.all([
                villageAPI.getById(vid),
                dataAPI.getRainfall(vid),
                dataAPI.getGroundwater(vid)
            ]);
            setVillage(villageRes.data);
            setRainfall(rainfallRes.data);
            setGroundwater(gwRes.data);

            try {
                const [wsiRes, droughtRes] = await Promise.all([
                    analysisAPI.getWSI(vid),
                    analysisAPI.getDrought(vid)
                ]);
                setWsi(wsiRes.data);
                setDrought(droughtRes.data);
            } catch { }
        } catch (err) {
            console.error('Failed to load village data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const storagePct = village
        ? Math.round((village.current_storage / village.storage_capacity) * 100)
        : 0;

    const tabs = [
        { id: 'overview', label: '📊 Overview' },
        { id: 'rainfall', label: '🌧️ Rainfall' },
        { id: 'groundwater', label: '💧 Groundwater' },
        { id: 'stress', label: '📈 Water Stress' },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">🏘️ {village?.name}</h1>
                <p className="text-gray-600 mb-6">{village?.district}, {village?.state} • Population: {village?.population?.toLocaleString()}</p>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
                        <h3 className="font-bold text-gray-800 text-lg mb-4">Village Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Name</span>
                                <span className="font-semibold">{village?.name}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">District</span>
                                <span className="font-semibold">{village?.district}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Population</span>
                                <span className="font-semibold">{village?.population?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Coordinates</span>
                                <span className="font-semibold text-sm">{village?.latitude}, {village?.longitude}</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card p-6">
                        <h3 className="font-bold text-gray-800 text-lg mb-4">Water Storage</h3>
                        <div className="text-center mb-4">
                            <div className={`text-5xl font-bold ${storagePct < 30 ? 'text-red-600' : storagePct < 50 ? 'text-orange-600' : 'text-green-600'}`}>
                                {storagePct}%
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Current Storage Level</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                            <div
                                className={`h-4 rounded-full bg-gradient-to-r ${storagePct < 30 ? 'from-red-500 to-red-600' : storagePct < 50 ? 'from-orange-500 to-yellow-500' : 'from-green-500 to-emerald-500'}`}
                                style={{ width: `${storagePct}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Current: {Number(village?.current_storage).toLocaleString()}L</span>
                            <span>Capacity: {Number(village?.storage_capacity).toLocaleString()}L</span>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Rainfall Tab */}
            {activeTab === 'rainfall' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
                    <h3 className="font-bold text-gray-800 text-lg mb-4">🌧️ Rainfall Records</h3>
                    {rainfall.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Rainfall (mm)</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rainfall.slice(0, 20).map((r, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm">{new Date(r.record_date).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 text-sm font-semibold">{Number(r.rainfall_mm).toFixed(1)} mm</td>
                                            <td className="py-3 px-4">
                                                <span className={`text-xs px-2 py-1 rounded-full ${r.is_historical ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                                                    {r.is_historical ? 'Historical' : 'Current'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No rainfall data available</p>
                    )}
                </motion.div>
            )}

            {/* Groundwater Tab */}
            {activeTab === 'groundwater' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
                    <h3 className="font-bold text-gray-800 text-lg mb-4">💧 Groundwater Records</h3>
                    {groundwater.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Water Level (m)</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Quality Index</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groundwater.slice(0, 20).map((g, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm">{new Date(g.measurement_date).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 text-sm font-semibold">{Number(g.water_level).toFixed(2)} m</td>
                                            <td className="py-3 px-4">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${g.quality_index >= 80 ? 'bg-green-100 text-green-700' :
                                                        g.quality_index >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {Number(g.quality_index).toFixed(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No groundwater data available</p>
                    )}
                </motion.div>
            )}

            {/* Water Stress Tab */}
            {activeTab === 'stress' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
                        <h3 className="font-bold text-gray-800 text-lg mb-4">📈 Water Stress Index</h3>
                        {wsi ? (
                            <div className="text-center">
                                <div className={`text-6xl font-bold ${wsi.wsi >= 70 ? 'text-red-600' : wsi.wsi >= 50 ? 'text-orange-600' : 'text-green-600'
                                    }`}>
                                    {typeof wsi.wsi === 'number' ? wsi.wsi.toFixed(1) : wsi.wsi}
                                </div>
                                <p className="text-gray-500 mt-2">WSI Score (0-100)</p>
                                <div className={`mt-4 px-4 py-2 rounded-lg inline-block ${wsi.wsi >= 70 ? 'bg-red-100 text-red-700' : wsi.wsi >= 50 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {wsi.wsi >= 70 ? '🔴 Critical Stress' : wsi.wsi >= 50 ? '🟠 Moderate Stress' : '🟢 Low Stress'}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">WSI data not available</p>
                        )}
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card p-6">
                        <h3 className="font-bold text-gray-800 text-lg mb-4">🌡️ Drought Analysis</h3>
                        {drought ? (
                            <div className="space-y-4">
                                {drought.rainfallDeficit !== undefined && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Rainfall Deficit</p>
                                        <p className="text-xl font-bold text-gray-800">{typeof drought.rainfallDeficit === 'number' ? drought.rainfallDeficit.toFixed(1) : drought.rainfallDeficit}%</p>
                                    </div>
                                )}
                                {drought.groundwaterTrend !== undefined && (
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Groundwater Trend</p>
                                        <p className="text-xl font-bold text-gray-800">{drought.groundwaterTrend}</p>
                                    </div>
                                )}
                                {drought.severity && (
                                    <div className={`p-3 rounded-lg ${drought.severity === 'critical' ? 'bg-red-50' : drought.severity === 'alert' ? 'bg-orange-50' : 'bg-green-50'
                                        }`}>
                                        <p className="text-sm text-gray-600">Drought Severity</p>
                                        <p className={`text-xl font-bold capitalize ${drought.severity === 'critical' ? 'text-red-700' : drought.severity === 'alert' ? 'text-orange-700' : 'text-green-700'
                                            }`}>
                                            {drought.severity}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Drought analysis not available</p>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default MyVillageData;
