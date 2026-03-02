import {
  validateAdminCredentials,
  saveAdminRefreshToken,
  clearAdminRefreshToken,
  getAdminByRefreshToken,
  getAdminById,
} from '../services/admin.auth.service.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/index.js';
import { errors } from '../utils/index.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await validateAdminCredentials(email, password);
    if (!admin) {
      return next(errors.unauthorized('Invalid credentials'));
    }
    const payload = { id: admin.id, role: 'admin' };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await saveAdminRefreshToken(admin.id, refreshToken);
    res.json({ success: true, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await clearAdminRefreshToken(req.user.id);
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const admin = await getAdminById(req.user.id);
    if (!admin) {
      return next(errors.notFound('Admin not found'));
    }
    res.json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
};
