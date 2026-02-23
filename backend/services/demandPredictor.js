import { Village } from '../models/index.js';
import { WSICalculator } from './wsiCalculator.js';

export class DemandPredictor {
  
  static async predictDemand(villageId) {
    const village = await Village.findByPk(villageId);
    if (!village) throw new Error('Village not found');

    const wsiData = await WSICalculator.calculateWSI(villageId);
    
    const dailyPerCapita = parseFloat(process.env.DAILY_WATER_PER_CAPITA) || 55;
    const highWSIThreshold = parseFloat(process.env.HIGH_WSI_THRESHOLD) || 70;
    const highWSIAdjustment = parseFloat(process.env.HIGH_WSI_ADJUSTMENT) || 1.20;

    // Base demand calculation
    let dailyDemand = village.population * dailyPerCapita;

    // Apply WSI adjustment
    if (wsiData.wsi > highWSIThreshold) {
      dailyDemand *= highWSIAdjustment;
    }

    // Calculate storage deficit
    const storageDeficit = Math.max(0, village.storage_capacity - village.current_storage);

    // Weekly and monthly projections
    const weeklyDemand = dailyDemand * 7;
    const monthlyDemand = dailyDemand * 30;

    return {
      villageId,
      villageName: village.name,
      population: village.population,
      wsi: wsiData.wsi,
      dailyDemand: parseFloat(dailyDemand.toFixed(2)),
      weeklyDemand: parseFloat(weeklyDemand.toFixed(2)),
      monthlyDemand: parseFloat(monthlyDemand.toFixed(2)),
      storageDeficit: parseFloat(storageDeficit.toFixed(2)),
      currentStorage: parseFloat(village.current_storage),
      storageCapacity: parseFloat(village.storage_capacity),
      urgency: wsiData.severity
    };
  }

  static async forecastDemand(villageId, days = 7) {
    const baseDemand = await this.predictDemand(villageId);
    
    const forecast = [];
    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        estimatedDemand: baseDemand.dailyDemand,
        cumulativeDemand: baseDemand.dailyDemand * i
      });
    }

    return {
      village: baseDemand,
      forecast
    };
  }
}
