import { registerUser, validateCredentials, saveRefreshToken, getUserByRefreshToken } from '../services/authService.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/index.js';
import { ErrorResponse } from '../utils/index.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser({ name, email, password });
    res.status(201).json({ success: true, data: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await validateCredentials(email, password);
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    const payload = { id: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await saveRefreshToken(user.id, refreshToken);
    res.json({ success: true, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return next(new ErrorResponse('Refresh token required', 400));
    }
    // verify cryptographic validity
    try {
      verifyRefreshToken(token);
    } catch (err) {
      return next(new ErrorResponse('Invalid refresh token', 401));
    }
    // make sure it's one we issued
    const user = await getUserByRefreshToken(token);
    if (!user) {
      return next(new ErrorResponse('Refresh token not recognized', 401));
    }
    const payload = { id: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    res.json({ success: true, accessToken });
  } catch (err) {
    next(err);
  }
};
