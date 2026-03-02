import express from 'express';
import { login, logout, me } from '../controllers/admin.auth.controller.js';
import { validateRequiredFields } from '../middlewares/index.js';
import { authenticateAdmin } from '../middlewares/admin.auth.middleware.js';

const router = express.Router();

router.post(
  '/login',
  validateRequiredFields('email', 'password'),
  login
);
router.post('/logout', authenticateAdmin, logout);
router.get('/me', authenticateAdmin, me);

export default router;
