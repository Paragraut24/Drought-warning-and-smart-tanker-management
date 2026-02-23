import express from 'express';
import { Tanker, Allocation, Village } from '../models/index.js';
import { AllocationService } from '../services/allocationService.js';
import { RouteOptimizer } from '../services/routeOptimizer.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const tanker = await Tanker.create(req.body);
    res.status(201).json(tanker);
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const tankers = await Tanker.findAll();
    res.json(tankers);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const tanker = await Tanker.findByPk(req.params.id);
    if (!tanker) {
      return res.status(404).json({ error: 'Tanker not found' });
    }
    await tanker.update(req.body);
    res.json(tanker);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const tanker = await Tanker.findByPk(req.params.id);
    if (!tanker) {
      return res.status(404).json({ error: 'Tanker not found' });
    }
    await tanker.destroy();
    res.json({ message: 'Tanker deleted successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/allocate', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const result = await AllocationService.allocateTankers();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/allocations', authenticate, async (req, res, next) => {
  try {
    const allocations = await AllocationService.getAllocations();
    res.json(allocations);
  } catch (error) {
    next(error);
  }
});

// Local user: get tanker allocations for their village
router.get('/my-village', authenticate, async (req, res, next) => {
  try {
    const village_id = req.user.village_id;
    if (!village_id) {
      return res.status(403).json({ error: 'No village linked to this user' });
    }
    const allocations = await Allocation.findAll({
      where: { village_id },
      include: [
        { model: Tanker },
        { model: Village, attributes: ['name', 'district'] }
      ],
      order: [['allocation_date', 'DESC']]
    });
    res.json(allocations);
  } catch (error) {
    next(error);
  }
});

router.post('/optimize-route', authenticate, async (req, res, next) => {
  try {
    const { startPoint, destinations } = req.body;
    const optimized = RouteOptimizer.optimizeRoute(startPoint, destinations);
    res.json(optimized);
  } catch (error) {
    next(error);
  }
});

export default router;
