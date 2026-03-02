import express from 'express';
import { db } from '../config/firebase.js';
import { listUsers } from '../services/user.data.service.js';
import { authenticateAdmin } from '../middlewares/admin.auth.middleware.js';

const router = express.Router();

// only admins can access
router.use(authenticateAdmin);

// get all regular users
router.get('/users', async (req, res, next) => {
  try {
    const users = await listUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

// get all admins
router.get('/admins', async (req, res, next) => {
  try {
    const snapshot = await db.collection('admins').get();
    const admins = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ success: true, data: admins });
  } catch (err) {
    next(err);
  }
});

export default router;
