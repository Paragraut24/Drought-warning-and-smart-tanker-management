import express from 'express';
import { Village } from '../models/index.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const village = await Village.create(req.body);
    res.status(201).json(village);
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const villages = await Village.findAll();
    res.json(villages);
  } catch (error) {
    next(error);
  }
});

// Get villages with priority scores for map visualization
router.get('/priority/all', authenticate, async (req, res, next) => {
  try {
    const villages = await Village.findAll({
      attributes: [
        'id', 'name', 'district', 'state', 'population',
        'latitude', 'longitude', 'storage_capacity', 'current_storage'
      ]
    });

    // Calculate priority score for each village
    const villagesWithPriority = villages.map(village => {
      const storagePercent = (village.current_storage / village.storage_capacity) * 100;
      
      // Priority calculation (0-100 scale)
      // Lower storage = Higher priority
      let priorityScore = 0;
      
      if (storagePercent < 20) {
        priorityScore = 90 + (20 - storagePercent); // 90-100 (Critical)
      } else if (storagePercent < 30) {
        priorityScore = 75 + ((30 - storagePercent) * 1.5); // 75-90 (High)
      } else if (storagePercent < 50) {
        priorityScore = 35 + ((50 - storagePercent) * 2); // 35-75 (Medium)
      } else {
        priorityScore = Math.max(0, 35 - ((storagePercent - 50) * 0.7)); // 0-35 (Low)
      }

      return {
        id: village.id,
        name: village.name,
        district: village.district,
        state: village.state,
        population: village.population,
        latitude: parseFloat(village.latitude),
        longitude: parseFloat(village.longitude),
        storagePercent: parseFloat(storagePercent.toFixed(2)),
        priorityScore: parseFloat(priorityScore.toFixed(2)),
        category: priorityScore >= 75 ? 'critical' : priorityScore >= 35 ? 'alert' : 'normal'
      };
    });

    res.json(villagesWithPriority);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const village = await Village.findByPk(req.params.id);
    if (!village) {
      return res.status(404).json({ error: 'Village not found' });
    }
    res.json(village);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const village = await Village.findByPk(req.params.id);
    if (!village) {
      return res.status(404).json({ error: 'Village not found' });
    }
    await village.update(req.body);
    res.json(village);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const village = await Village.findByPk(req.params.id);
    if (!village) {
      return res.status(404).json({ error: 'Village not found' });
    }
    await village.destroy();
    res.json({ message: 'Village deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
