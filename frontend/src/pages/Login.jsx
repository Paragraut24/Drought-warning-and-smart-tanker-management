import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [activeTab, setActiveTab] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [villageId, setVillageId] = useState('');
  const [villages, setVillages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch villages for registration dropdown
    const fetchVillages = async () => {
      try {
        const res = await authAPI.getVillages();
        setVillages(res.data || []);
      } catch (err) {
        console.error('Failed to load villages:', err);
        setError('Failed to load villages. Please refresh the page.');
      }
    };
    fetchVillages();
  }, []);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setPhone('');
    setVillageId('');
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      login(response.data.token, response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authAPI.register({
        username,
        email,
        password,
        role: 'local_user',
        village_id: parseInt(villageId),
        phone: phone || undefined
      });
      setSuccess('Registration successful! You can now sign in.');
      setTimeout(() => {
        setIsLoginMode(true);
        resetForm();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:block"
        >
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-2">
              JalRakshak AI
            </h1>
            <p className="text-xl text-blue-600 font-semibold mb-4">
              जल रक्षक - पानी का संरक्षक
            </p>
            <p className="text-lg text-gray-600 mb-2">
              Intelligent Water Distribution System
            </p>
            <p className="text-md text-gray-500">
              Vidarbha Region Water Crisis Management
            </p>
            <div className="mt-8 space-y-3 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-2xl">💧</span>
                <span>Real-time drought monitoring</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-2xl">🚛</span>
                <span>Smart tanker allocation</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-2xl">📊</span>
                <span>AI-powered predictions</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="text-2xl">🏘️</span>
                <span>Village-level water tracking</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login/Register Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-8"
        >
          {isLoginMode ? (
            <>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to access JalRakshak</p>
              </div>

              {/* Role Tab Selector */}
              <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => { setActiveTab('admin'); resetForm(); }}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'admin'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  🔧 Admin
                </button>
                <button
                  onClick={() => { setActiveTab('local'); resetForm(); }}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'local'
                      ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  🏘️ Local User
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder={activeTab === 'admin' ? 'admin@water.gov' : 'user@email.com'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${activeTab === 'admin'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25'
                      : 'bg-gradient-to-r from-green-500 to-teal-600 hover:shadow-lg hover:shadow-green-500/25'
                    }`}
                >
                  {loading ? 'Signing in...' : `Sign In as ${activeTab === 'admin' ? 'Admin' : 'Local User'}`}
                </motion.button>
              </form>

              {activeTab === 'local' && (
                <div className="mt-6 text-center">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <button
                      onClick={() => { setIsLoginMode(false); resetForm(); }}
                      className="text-green-600 font-semibold hover:underline"
                    >
                      Register here
                    </button>
                  </p>
                </div>
              )}

              <div className="mt-5 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 font-semibold mb-2">Demo Credentials:</p>
                {activeTab === 'admin' ? (
                  <p className="text-xs text-gray-600">admin@water.gov / admin123</p>
                ) : (
                  <p className="text-xs text-gray-600">localuser@water.gov / local123</p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Registration Form */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                <p className="text-gray-600">Register as a local village user</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="Create a strong password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Your Village</label>
                  <select
                    value={villageId}
                    onChange={(e) => setVillageId(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">-- Choose your village --</option>
                    {villages.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.district})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone (optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                    placeholder="Your phone number"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
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
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-teal-600 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </motion.button>
              </form>

              <div className="mt-5 text-center">
                <button
                  onClick={() => { setIsLoginMode(true); resetForm(); }}
                  className="text-blue-600 font-semibold text-sm hover:underline"
                >
                  ← Back to Sign In
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
