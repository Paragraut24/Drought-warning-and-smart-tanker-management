import { RainfallRecord, GroundwaterRecord } from '../models/index.js';
import { Op } from 'sequelize';

export class DroughtEngine {
  
  static async calculateRainfallDeviation(villageId, currentDate) {
    const currentYear = new Date(currentDate).getFullYear();
    const currentMonth = new Date(currentDate).getMonth() + 1;

    // Get current rainfall
    const currentRainfall = await RainfallRecord.sum('rainfall_mm', {
      where: {
        village_id: villageId,
        record_date: {
          [Op.gte]: new Date(currentYear, currentMonth - 1, 1),
          [Op.lt]: new Date(currentYear, currentMonth, 1)
        },
        is_historical: false
      }
    }) || 0;

    // Get historical average for same month
    const historicalAvg = await RainfallRecord.findAll({
      where: {
        village_id: villageId,
        is_historical: true,
        record_date: {
          [Op.and]: [
            { [Op.gte]: new Date(2000, currentMonth - 1, 1) },
            { [Op.lt]: new Date(2000, currentMonth, 1) }
          ]
        }
      },
      attributes: [[sequelize.fn('AVG', sequelize.col('rainfall_mm')), 'avg_rainfall']]
    });

    const historicalValue = historicalAvg[0]?.dataValues?.avg_rainfall || 0;

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

    // Calculate linear regression slope
    const n = records.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    records.forEach((record, index) => {
      const x = index;
      const y = parseFloat(record.water_level);
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    // Positive slope means water level is declining (worse)
    const trendScore = Math.min(100, Math.max(0, slope * 10));

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
