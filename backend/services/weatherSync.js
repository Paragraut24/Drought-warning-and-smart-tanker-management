import { Village, RainfallRecord, GroundwaterRecord } from '../models/index.js';
import { fetchHistoricalRainfall, fetchTodayRainfall } from './openMeteoService.js';
import { Op } from 'sequelize';

/**
 * Estimate groundwater level from rainfall data.
 *
 * Simple recharge model:
 *  - Base depth: 15m below ground (starting assumption for Vidarbha)
 *  - Each mm of rain contributes a small recharge (reduces depth)
 *  - Daily natural depletion pushes depth deeper
 *  - Critical villages start deeper (worse)
 *
 * Returns meters below ground level (higher = worse).
 */
function estimateGroundwaterFromRainfall(village, rainfallLast30Days, rainfallLast7Days) {
  // Base depth depends on region's storage capacity ratio
  const storageRatio = village.current_storage / village.storage_capacity;
  const baseDepth = storageRatio < 0.3 ? 18 : storageRatio < 0.5 ? 14 : 10;

  // Rainfall recharge: each mm of rain in last 30 days reduces depth slightly
  // Typical infiltration factor for Maharashtra black soil: ~10-15%
  const rechargeFromRain = (rainfallLast30Days * 0.12) / 1000; // convert to meters
  const recentRecharge = (rainfallLast7Days * 0.15) / 1000; // recent rain has more effect

  // Estimated level (higher value = deeper = worse)
  let level = baseDepth - (rechargeFromRain * 5) - (recentRecharge * 10);

  // Add some natural variation
  level = Math.max(2, Math.min(25, level)); // clamp between 2m and 25m

  // Quality index: more rain → better quality (less contamination from deeper sources)
  const quality = Math.min(95, 60 + (rainfallLast30Days * 0.1));

  return {
    water_level: parseFloat(level.toFixed(2)),
    quality_index: parseFloat(quality.toFixed(1))
  };
}

/**
 * Upsert a rainfall record: update if (village_id, record_date) exists, create if not.
 */
async function upsertRainfall(village_id, date, rainfall_mm, is_historical = false) {
  const existing = await RainfallRecord.findOne({
    where: { village_id, record_date: date }
  });

  if (existing) {
    await existing.update({ rainfall_mm, is_historical });
    return 'updated';
  } else {
    await RainfallRecord.create({ village_id, record_date: date, rainfall_mm, is_historical });
    return 'created';
  }
}

/**
 * Upsert a groundwater record.
 */
async function upsertGroundwater(village_id, date, water_level, quality_index) {
  const existing = await GroundwaterRecord.findOne({
    where: { village_id, measurement_date: date }
  });

  if (existing) {
    await existing.update({ water_level, quality_index });
    return 'updated';
  } else {
    await GroundwaterRecord.create({ village_id, measurement_date: date, water_level, quality_index });
    return 'created';
  }
}

// ─────────────────────────────────────────────
// ONE-TIME HISTORICAL BACKFILL (8 months)
// ─────────────────────────────────────────────

/**
 * Deletes all old synthetic data, then fetches 8 months of real historical
 * rainfall from Open-Meteo for all villages and estimates groundwater.
 */
export async function backfillHistoricalData() {
  console.log('\n📦 Starting historical data backfill (8 months)...\n');

  // 1. Delete all old synthetic rainfall & groundwater
  const deletedRain = await RainfallRecord.destroy({ where: {} });
  const deletedGW = await GroundwaterRecord.destroy({ where: {} });
  console.log(`🗑️  Cleared ${deletedRain} old rainfall records, ${deletedGW} groundwater records.\n`);

  // 2. Calculate date range: 8 months ago → yesterday
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 8);

  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  console.log(`📅 Fetching rainfall from ${startStr} to ${endStr}\n`);

  const villages = await Village.findAll();
  let totalRecords = 0;

  for (const village of villages) {
    try {
      // Fetch historical rainfall from Open-Meteo
      const data = await fetchHistoricalRainfall(
        village.latitude, village.longitude, startStr, endStr
      );

      // Insert rainfall records
      for (const day of data) {
        await upsertRainfall(village.id, day.date, day.rainfall_mm, true);
      }

      // Estimate groundwater monthly (one record per month)
      const months = {};
      for (const day of data) {
        const monthKey = day.date.substring(0, 7); // YYYY-MM
        if (!months[monthKey]) months[monthKey] = [];
        months[monthKey].push(day.rainfall_mm);
      }

      for (const [monthKey, dailyRains] of Object.entries(months)) {
        const totalRain30 = dailyRains.reduce((s, r) => s + r, 0);
        const last7 = dailyRains.slice(-7).reduce((s, r) => s + r, 0);
        const gw = estimateGroundwaterFromRainfall(village, totalRain30, last7);
        const gwDate = `${monthKey}-15`; // mid-month
        await upsertGroundwater(village.id, gwDate, gw.water_level, gw.quality_index);
      }

      totalRecords += data.length;
      console.log(`  ✅ ${village.name}: ${data.length} days of rainfall loaded`);
    } catch (err) {
      console.error(`  ❌ ${village.name}: ${err.message}`);
    }
  }

  console.log(`\n🎉 Backfill complete — ${totalRecords} rainfall records across ${villages.length} villages.\n`);
}

// ─────────────────────────────────────────────
// DAILY SYNC (twice per day)
// ─────────────────────────────────────────────

/**
 * Fetches today's (and yesterday's) rainfall from Open-Meteo for all villages.
 * Uses upsert so only one record per village per day exists.
 * Also updates groundwater estimates.
 */
export async function syncDailyData() {
  const timestamp = new Date().toISOString();
  console.log(`\n🌤️  [${timestamp}] Running daily weather sync...`);

  const villages = await Village.findAll();
  let successCount = 0;

  for (const village of villages) {
    try {
      // Fetch today + yesterday rainfall
      const data = await fetchTodayRainfall(village.latitude, village.longitude);

      for (const day of data) {
        await upsertRainfall(village.id, day.date, day.rainfall_mm, false);
      }

      // Estimate groundwater from last 30 days of rainfall
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const rain30 = await RainfallRecord.sum('rainfall_mm', {
        where: {
          village_id: village.id,
          record_date: { [Op.gte]: thirtyDaysAgo.toISOString().split('T')[0] }
        }
      }) || 0;

      const rain7 = await RainfallRecord.sum('rainfall_mm', {
        where: {
          village_id: village.id,
          record_date: { [Op.gte]: sevenDaysAgo.toISOString().split('T')[0] }
        }
      }) || 0;

      const gw = estimateGroundwaterFromRainfall(village, rain30, rain7);
      const today = new Date().toISOString().split('T')[0];
      await upsertGroundwater(village.id, today, gw.water_level, gw.quality_index);

      const todayRain = data.find(d => d.date === today);
      console.log(`  ✅ ${village.name}: ${todayRain?.rainfall_mm ?? 0}mm today, GW: ${gw.water_level}m`);
      successCount++;
    } catch (err) {
      console.error(`  ❌ ${village.name}: ${err.message}`);
    }
  }

  console.log(`🏁 Daily sync done — ${successCount}/${villages.length} villages updated.\n`);
}

/**
 * Start the scheduler: runs sync immediately, then twice per day (every 12 hours).
 */
export function startDataSyncScheduler() {
  const intervalMs = 12 * 60 * 60 * 1000; // 12 hours

  console.log('🌦️  Data auto-sync enabled (every 12 hours)');

  // Run immediately (small delay for DB readiness)
  setTimeout(() => {
    syncDailyData().catch(err => console.error('Initial sync error:', err.message));
  }, 3000);

  // Repeat every 12 hours
  setInterval(() => {
    syncDailyData().catch(err => console.error('Scheduled sync error:', err.message));
  }, intervalMs);
}
