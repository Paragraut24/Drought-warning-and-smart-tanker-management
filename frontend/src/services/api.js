import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData)
};

export const villageAPI = {
  getAll: () => api.get('/villages'),
  getById: (id) => api.get(`/villages/${id}`),
  create: (data) => api.post('/villages', data),
  update: (id, data) => api.put(`/villages/${id}`, data)
};

export const dataAPI = {
  addRainfall: (data) => api.post('/data/rainfall', data),
  addRainfallBulk: (records) => api.post('/data/rainfall/bulk', { records }),
  getRainfall: (villageId) => api.get(`/data/rainfall/${villageId}`),
  addGroundwater: (data) => api.post('/data/groundwater', data),
  addGroundwaterBulk: (records) => api.post('/data/groundwater/bulk', { records }),
  getGroundwater: (villageId) => api.get(`/data/groundwater/${villageId}`)
};

export const analysisAPI = {
  getDrought: (villageId) => api.get(`/analysis/drought/${villageId}`),
  getWSI: (villageId) => api.get(`/analysis/wsi/${villageId}`),
  getAllWSI: () => api.get('/analysis/wsi'),
  getCritical: (threshold) => api.get(`/analysis/critical?threshold=${threshold}`),
  predictDemand: (villageId) => api.get(`/analysis/predict/${villageId}`),
  forecastDemand: (villageId, days) => api.get(`/analysis/forecast/${villageId}?days=${days}`)
};

export const tankerAPI = {
  getAll: () => api.get('/tankers'),
  create: (data) => api.post('/tankers', data),
  update: (id, data) => api.put(`/tankers/${id}`, data),
  allocate: () => api.post('/tankers/allocate'),
  getAllocations: () => api.get('/tankers/allocations'),
  optimizeRoute: (data) => api.post('/tankers/optimize-route', data)
};

export const alertAPI = {
  getAll: () => api.get('/alerts'),
  getActive: () => api.get('/alerts/active'),
  create: (data) => api.post('/alerts', data),
  resolve: (id) => api.put(`/alerts/${id}/resolve`)
};

export default api;
