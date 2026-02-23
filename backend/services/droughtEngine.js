import { RainfallRecord, GroundwaterRecord } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

export class DroughtEngine {
  
  static async calculateRainfallDeviation(villageId, currentDate) {
    const currentYear = new Date(currentDate).getFullYear();
    const currentMonth = new Date(currentDate).getMonth() + 1;

    // Get current year rainfall (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const currentRainfall = await RainfallRecord.sum('rainfall_mm', {
      where: {
        village_id: villageId,
        record_date: {
          [Op.gte]: sixMonthsAgo
        },
        is_historical: false
      }
    }) || 0;

    // Get historical average for same period
    const historicalRainfall = await RainfallRecord.sum('rainfall_mm', {
      where: {
        village_id: villageId,
        is_historical: true
      }
    }) || 0;
    
    // Calculate average per month from historical data
    const historicalCount = await RainfallRecord.count({
      where: {
        village_id: villageId,
        is_historical: true
      }
    });
    
    const historicalValue = historicalCount > 0 ? (historicalRainfall / historicalCount) * 6 : 0;

    if (historicalValue === 0) {
      return { deviation: 0, current: currentRainfall, historical: 0 };
    }

    const deviation = ((historicalValue - currentRainfall) / historicalValue) * 100;

    return {
      deviation: Math.max(0, deviation),
      current: currentRainfall,
      historical: historicalValue
    };
  }

  static async calculateGroundwaterTrend(villageId, months = 6) {
    const records = await GroundwaterRecord.findAll({
      where: { village_id: villageId },
      order: [['measurement_date', 'DESC']],
      limit: months
    });

    if (records.length < 2) {
      return { trend: 0, slope: 0, records: records.length };
    }

    // Reverse to get chronological order
    const chronological = records.reverse();

    // Calculate linear regression slope
    const n = chronological.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    chronological.forEach((record, index) => {
      const x = index;
      const y = parseFloat(record.water_level);
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    // Positive slope means water level is increasing (going deeper - worse)
    // Normalize to 0-100 scale
    const trendScore = Math.min(100, Math.max(0, slope * 20));

    return {
      trend: trendScore,
      slope: slope,
      records: n,
      latestLevel: parseFloat(records[0].water_level)
    };
  }

  static classifySeverity(score) {
    if (score <= 30) return 'normal';
    if (score <= 70) return 'alert';
    return 'critical';
  }

  static async analyzeDrought(villageId) {
    const rainfallData = await this.calculateRainfallDeviation(villageId, new Date());
    const groundwaterData = await this.calculateGroundwaterTrend(villageId);

    const combinedScore = (rainfallData.deviation * 0.6) + (groundwaterData.trend * 0.4);
    const severity = this.classifySeverity(combinedScore);

    return {
      villageId,
      rainfallDeviation: rainfallData.deviation,
      groundwaterTrend: groundwaterData.trend,
      combinedScore,
      severity,
      details: {
        rainfall: rainfallData,
        groundwater: groundwaterData
      }
    };
  }
}
