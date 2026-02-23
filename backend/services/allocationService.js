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
    // Get all available tankers
    const availableTankers = await Tanker.findAll({
      where: { status: 'available' }
    });

    if (availableTankers.length === 0) {
      return { message: 'No tankers available', allocations: [] };
    }

    // Get all villages with priority scores
    const villages = await Village.findAll();
    const priorities = await Promise.all(
      villages.map(v => this.calculatePriority(v.id))
    );

    // Sort by priority (highest first)
    priorities.sort((a, b) => b.priority - a.priority);

    // Allocate tankers to highest priority villages
    const allocations = [];
    for (let i = 0; i < Math.min(availableTankers.length, priorities.length); i++) {
      const tanker = availableTankers[i];
      const village = priorities[i];

      const allocation = await Allocation.create({
        village_id: village.villageId,
        tanker_id: tanker.id,
        priority_score: village.priority,
        status: 'pending'
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
      message: `Allocated ${allocations.length} tankers`,
      allocations
    };
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
