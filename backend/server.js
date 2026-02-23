import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import villageRoutes from './routes/villages.js';
import dataRoutes from './routes/data.js';
import analysisRoutes from './routes/analysis.js';
import tankerRoutes from './routes/tankers.js';
import alertRoutes from './routes/alerts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/villages', villageRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/tankers', tankerRoutes);
app.use('/api/alerts', alertRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Water Governance API is running' });
});

app.use(errorHandler);

// Database sync and server start
sequelize.sync({ alter: false })
  .then(() => {
    console.log('Database connected and synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });
