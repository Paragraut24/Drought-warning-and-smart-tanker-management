import { Village, Tanker, Allocation } from '../models/index.js';
import { WSICalculator } from './wsiCalculator.js';

export class AllocationService {
  
  static async calculatePriority(villageId) {
    const village = await Village.findByPk(villageId);
    if (!village) throw new Error('Village not found');

    const wsiData = await WSICalculator.calculateWSI(villageId);
    
    const storageDeficit = ((village.storage_capacity - village.current_storage) / village.storage_capacity) * 100;
    const normalizedPopulation = Math.min(100, (village.population / 50000) * 100);

    const priority = (
      (wsiData.wsi * 0.5) +
      (normalizedPopulation * 0.3) +
      (storageDeficit * 0.2)
    );

    return {
      villageId,
      priority: parseFloat(priority.toFixed(2)),
      wsi: wsiData.wsi,
      storageDeficit,
      population: village.population
    };
  }

  static async allocateTankers() {
    try {
      // Get all available tankers
      const availableTankers = await Tanker.findAll({
        where: { status: 'available' }
      });

      if (availableTankers.length === 0) {
        return { 
          success: false,
          message: 'No tankers available for allocation', 
          allocations: [] 
        };
      }

      // Get all villages with priority scores
      const villages = await Village.findAll();
      
      if (villages.length === 0) {
        return {
          success: false,
          message: 'No villages found in database',
          allocations: []
        };
      }

      const priorities = [];
      for (const village of villages) {
        try {
          const priority = await this.calculatePriority(village.id);
          priorities.push(priority);
        } catch (error) {
          console.error(`Error calculating priority for village ${village.id}:`, error.message);
          // Continue with other villages
        }
      }

      if (priorities.length === 0) {
        return {
          success: false,
          message: 'Could not calculate priorities for any village',
          allocations: []
        };
      }

      // Sort by priority (highest first)
      priorities.sort((a, b) => b.priority - a.priority);

      // Allocate tankers to highest priority villages
      const allocations = [];
      const numAllocations = Math.min(availableTankers.length, priorities.length);
      
      for (let i = 0; i < numAllocations; i++) {
        const tanker = availableTankers[i];
        const village = priorities[i];

        const allocation = await Allocation.create({
          village_id: village.villageId,
          tanker_id: tanker.id,
          priority_score: village.priority,
          status: 'pending',
          allocation_date: new Date()
        });

        // Update tanker status
        await tanker.update({ status: 'assigned' });

        allocations.push({
          allocationId: allocation.id,
          tankerId: tanker.id,
          tankerRegistration: tanker.registration_number,
          villageId: village.villageId,
          priorityScore: village.priority
        });
      }

      return {
        success: true,
        message: `Successfully allocated ${allocations.length} tanker(s) to critical villages`,
        allocations
      };
    } catch (error) {
      console.error('Allocation error:', error);
      throw new Error(`Allocation failed: ${error.message}`);
    }
  }

  static async getAllocations() {
    const allocations = await Allocation.findAll({
      include: [
        { model: Village, attributes: ['name', 'district', 'latitude', 'longitude'] },
        { model: Tanker, attributes: ['registration_number', 'capacity', 'status'] }
      ],
      order: [['priority_score', 'DESC']]
    });

    return allocations;
  }
}
