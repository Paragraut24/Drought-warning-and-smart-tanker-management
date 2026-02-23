import express from 'express';
import { Alert, Village } from '../models/index.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('admin', 'operator'), async (req, res, next) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json(alert);
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const alerts = await Alert.findAll({
      include: [{ model: Village, attributes: ['name', 'district'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(alerts);
  } catch (error) {
    next(error);
  }
});

router.get('/active', authenticate, async (req, res, next) => {
  try {
    const alerts = await Alert.findAll({
      where: { is_resolved: false },
      include: [{ model: Village, attributes: ['name', 'district'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(alerts);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/resolve', authenticate, authorize('admin', 'operator'), async (req, res, next) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    await alert.update({ is_resolved: true });
    res.json(alert);
  } catch (error) {
    next(error);
  }
});

export default router;
