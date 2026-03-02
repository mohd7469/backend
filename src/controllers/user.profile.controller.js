import {
  getUserById,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from '../services/user.data.service.js';
import { errors } from '../utils/index.js';

// profile endpoints for authenticated user
export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return next(errors.notFound('User not found'));
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    // users cannot change their role or password here
    delete updates.role;
    delete updates.password;
    const user = await updateUserService(req.user.id, updates);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    await deleteUserService(req.user.id);
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
};
