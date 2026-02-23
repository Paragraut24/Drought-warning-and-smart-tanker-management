/**
 * One-time script to backfill 8 months of real historical rainfall data
 * from Open-Meteo and estimate groundwater records.
 *
 * Run: node backfill-weather.js
 *
 * This will:
 * 1. Delete ALL existing rainfall and groundwater records
 * 2. Fetch 8 months of real daily rainfall from Open-Meteo for every village
 * 3. Estimate groundwater levels from rainfall patterns
 */

import dotenv from 'dotenv';
dotenv.config();

import sequelize from './config/database.js';
import { backfillHistoricalData } from './services/weatherSync.js';

async function run() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database connected.\n');

    await backfillHistoricalData();

    console.log('✅ Backfill complete! You can now start the server.\n');
  } catch (err) {
    console.error('❌ Backfill failed:', err);
  } finally {
    await sequelize.close();
  }
}

run();
