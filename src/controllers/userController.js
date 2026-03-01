import {
  listUsers,
  getUserById,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from '../services/userService.js';
import { ErrorResponse } from '../utils/index.js';

// Only admin can list all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await listUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// Users can fetch their own profile, admin can fetch anyone
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return next(new ErrorResponse('Forbidden', 403));
    }
    const user = await getUserById(id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return next(new ErrorResponse('Forbidden', 403));
    }
    const updates = { ...req.body };
    // don't let users change role themselves
    if (req.user.role !== 'admin') {
      delete updates.role;
      delete updates.password; // password change should be a separate flow
    }
    const user = await updateUserService(id, updates);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return next(new ErrorResponse('Forbidden', 403));
    }
    await deleteUserService(id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
