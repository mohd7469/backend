import express from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/index.js';
import { authenticate, authorize } from '../middlewares/index.js';

const router = express.Router();

// all user routes require authentication
router.use(authenticate);

router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
