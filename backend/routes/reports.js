import express from 'express';
import { WaterShortageReport, Village } from '../models/index.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Local user submits a water shortage report
router.post('/water-shortage', authenticate, async (req, res, next) => {
  try {
    const { description, severity } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    // Use village_id from the authenticated user's token
    const village_id = req.user.village_id;
    if (!village_id) {
      return res.status(403).json({ error: 'Only local users linked to a village can submit reports' });
    }

    const report = await WaterShortageReport.create({
      user_id: req.user.id,
      village_id,
      description,
      severity: severity || 'medium'
    });

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
});

// Local user gets their own submitted reports
router.get('/my-reports', authenticate, async (req, res, next) => {
  try {
    const reports = await WaterShortageReport.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Village, attributes: ['name', 'district'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(reports);
  } catch (error) {
    next(error);
  }
});

// Admin gets all reports
router.get('/all', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const reports = await WaterShortageReport.findAll({
      include: [{ model: Village, attributes: ['name', 'district'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(reports);
  } catch (error) {
    next(error);
  }
});

// Admin updates report status
router.put('/:id/status', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const report = await WaterShortageReport.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    await report.update({ status: req.body.status });
    res.json(report);
  } catch (error) {
    next(error);
  }
});

export default router;
