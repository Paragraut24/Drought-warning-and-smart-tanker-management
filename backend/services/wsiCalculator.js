import { Village } from '../models/index.js';
import { DroughtEngine } from './droughtEngine.js';

export class WSICalculator {
  
  static getWeights() {
    return {
      rainfall: parseFloat(process.env.WSI_RAINFALL_WEIGHT) || 0.35,
      groundwater: parseFloat(process.env.WSI_GROUNDWATER_WEIGHT) || 0.30,
      population: parseFloat(process.env.WSI_POPULATION_WEIGHT) || 0.20,
      storage: parseFloat(process.env.WSI_STORAGE_WEIGHT) || 0.15
    };
  }

  static normalizeScore(value, min, max) {
    if (max === min) return 0;
    return ((value - min) / (max - min)) * 100;
  }

  static async calculateWSI(villageId) {
    const village = await Village.findByPk(villageId);
    if (!village) throw new Error('Village not found');

    const weights = this.getWeights();
    
    // Get drought analysis
    const droughtData = await DroughtEngine.analyzeDrought(villageId);
    
    // Rainfall score (higher deviation = higher stress)
    const rainfallScore = droughtData.rainfallDeviation;
    
    // Groundwater score (higher trend = higher stress)
    const groundwaterScore = droughtData.groundwaterTrend;
    
    // Population score (normalized against max population)
    const maxPopulation = 50000; // configurable threshold
    const populationScore = this.normalizeScore(village.population, 0, maxPopulation);
    
    // Storage score (lower storage = higher stress)
    const storageDeficit = ((village.storage_capacity - village.current_storage) / village.storage_capacity) * 100;
    const storageScore = storageDeficit;

    // Calculate WSI
    const wsi = (
      (weights.rainfall * rainfallScore) +
      (weights.groundwater * groundwaterScore) +
      (weights.population * populationScore) +
      (weights.storage * storageScore)
    );

    return {
      villageId,
      villageName: village.name,
      wsi: parseFloat(wsi.toFixed(2)),
      severity: DroughtEngine.classifySeverity(wsi),
      components: {
        rainfall: rainfallScore,
        groundwater: groundwaterScore,
        population: populationScore,
        storage: storageScore
      },
      weights
    };
  }

  static async calculateAllWSI() {
    const villages = await Village.findAll();
    const results = await Promise.all(
      villages.map(v => this.calculateWSI(v.id))
    );
    
    return results.sort((a, b) => b.wsi - a.wsi);
  }

  static async getCriticalVillages(threshold = 70) {
    const allWSI = await this.calculateAllWSI();
    return allWSI.filter(v => v.wsi >= threshold);
  }
}
