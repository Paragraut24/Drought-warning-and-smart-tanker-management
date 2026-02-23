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
