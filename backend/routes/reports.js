import express from 'express';
import { WaterShortageReport, Village, Alert } from '../models/index.js';
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

    // Get village info
    const village = await Village.findByPk(village_id);

    // Create the report
    const report = await WaterShortageReport.create({
      user_id: req.user.id,
      village_id,
      description,
      severity: severity || 'medium'
    });

    // Automatically create an alert for admin
    const alertSeverity = severity === 'high' ? 'critical' : severity === 'medium' ? 'alert' : 'normal';
    const alertMessage = `Water shortage reported by local user in ${village.name}: ${description}`;

    await Alert.create({
      village_id,
      severity: alertSeverity,
      message: alertMessage,
      is_resolved: false
    });

    res.status(201).json({
      report,
      message: 'Report submitted successfully. An alert has been created for the admin team.'
    });
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
