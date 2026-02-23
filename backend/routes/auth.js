import express from 'express';
import jwt from 'jsonwebtoken';
import { User, Village } from '../models/index.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, role, village_id, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // If registering as local_user, village_id is required
    const userRole = role || 'local_user';
    if (userRole === 'local_user' && !village_id) {
      return res.status(400).json({ error: 'Village selection is required for local users' });
    }

    // Verify village exists if provided
    if (village_id) {
      const village = await Village.findByPk(village_id);
      if (!village) {
        return res.status(400).json({ error: 'Selected village not found' });
      }
    }

    const user = await User.create({
      username,
      email,
      password,
      role: userRole,
      village_id: userRole === 'local_user' ? village_id : null,
      phone: phone || null
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: user.id
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: Village, attributes: ['id', 'name', 'district'] }]
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        village_id: user.village_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        village_id: user.village_id,
        village: user.Village ? {
          id: user.Village.id,
          name: user.Village.name,
          district: user.Village.district
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get list of villages for registration dropdown (public)
router.get('/villages', async (req, res, next) => {
  try {
    const villages = await Village.findAll({
      attributes: ['id', 'name', 'district'],
      order: [['name', 'ASC']]
    });
    res.json(villages);
  } catch (error) {
    next(error);
  }
});

// Get current user profile
router.get('/me', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'email', 'role', 'phone', 'village_id'],
      include: [{ model: Village, attributes: ['id', 'name', 'district'] }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
      village_id: user.village_id,
      village: user.Village ? {
        id: user.Village.id,
        name: user.Village.name,
        district: user.Village.district
      } : null
    });
  } catch (error) {
    next(error);
  }
});

export default router;
