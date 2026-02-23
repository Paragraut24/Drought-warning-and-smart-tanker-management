import express from 'express';
import { RainfallRecord, GroundwaterRecord } from '../models/index.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Rainfall endpoints
router.post('/rainfall', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const record = await RainfallRecord.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
});

router.post('/rainfall/bulk', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const records = await RainfallRecord.bulkCreate(req.body.records);
    res.status(201).json({ message: `Created ${records.length} records`, records });
  } catch (error) {
    next(error);
  }
});

router.get('/rainfall/:villageId', authenticate, async (req, res, next) => {
  try {
    const records = await RainfallRecord.findAll({
      where: { village_id: req.params.villageId },
      order: [['record_date', 'DESC']]
    });
    res.json(records);
  } catch (error) {
    next(error);
  }
});

// Groundwater endpoints
router.post('/groundwater', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const record = await GroundwaterRecord.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
});

router.post('/groundwater/bulk', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const records = await GroundwaterRecord.bulkCreate(req.body.records);
    res.status(201).json({ message: `Created ${records.length} records`, records });
  } catch (error) {
    next(error);
  }
});

router.get('/groundwater/:villageId', authenticate, async (req, res, next) => {
  try {
    const records = await GroundwaterRecord.findAll({
      where: { village_id: req.params.villageId },
      order: [['measurement_date', 'DESC']]
    });
    res.json(records);
  } catch (error) {
    next(error);
  }
});

export default router;
