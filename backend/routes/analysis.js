import express from 'express';
import { DroughtEngine } from '../services/droughtEngine.js';
import { WSICalculator } from '../services/wsiCalculator.js';
import { DemandPredictor } from '../services/demandPredictor.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/drought/:villageId', authenticate, async (req, res, next) => {
  try {
    const analysis = await DroughtEngine.analyzeDrought(req.params.villageId);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
});

router.get('/wsi/:villageId', authenticate, async (req, res, next) => {
  try {
    const wsi = await WSICalculator.calculateWSI(req.params.villageId);
    res.json(wsi);
  } catch (error) {
    next(error);
  }
});

router.get('/wsi', authenticate, async (req, res, next) => {
  try {
    const allWSI = await WSICalculator.calculateAllWSI();
    res.json(allWSI);
  } catch (error) {
    next(error);
  }
});

router.get('/critical', authenticate, async (req, res, next) => {
  try {
    const threshold = parseFloat(req.query.threshold) || 70;
    const critical = await WSICalculator.getCriticalVillages(threshold);
    res.json(critical);
  } catch (error) {
    next(error);
  }
});

router.get('/predict/:villageId', authenticate, async (req, res, next) => {
  try {
    const prediction = await DemandPredictor.predictDemand(req.params.villageId);
    res.json(prediction);
  } catch (error) {
    next(error);
  }
});

router.get('/forecast/:villageId', authenticate, async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const forecast = await DemandPredictor.forecastDemand(req.params.villageId, days);
    res.json(forecast);
  } catch (error) {
    next(error);
  }
});

export default router;
