import express from 'express';
import {
  getProfile,
  updateProfile,
  deleteAccount,
} from '../controllers/user.profile.controller.js';
import { authenticateUser } from '../middlewares/user.auth.middleware.js';
import { validateRequiredFields } from '../middlewares/index.js';

const router = express.Router();

router.use(authenticateUser);

router.get('/me', getProfile);
router.put('/me', validateRequiredFields('name', 'email'), updateProfile);
router.delete('/me', deleteAccount);

export default router;
