import express from 'express';
import {
  register,
  login,
  logout,
  sendVerificationOtp,
  verifyEmailOtp,
  forgotPassword,
  resetPassword,
  resendOtp,
  refreshToken,
  getProfile,
} from '../controllers/user.auth.controller.js';
import { validateRequiredFields } from '../middlewares/index.js';
import { authenticateUser } from '../middlewares/user.auth.middleware.js';

const router = express.Router();

// registration & auth
router.post(
  '/register',
  validateRequiredFields('name', 'email', 'password'),
  register
);
router.post(
  '/login',
  validateRequiredFields('email', 'password'),
  login
);
router.post('/logout', authenticateUser, logout);
router.get('/me', authenticateUser, getProfile);

// email verification
router.post(
  '/verify-email/generate',
  validateRequiredFields('email'),
  sendVerificationOtp
);
router.post(
  '/verify-email/validate',
  validateRequiredFields('email', 'otp'),
  verifyEmailOtp
);
router.post('/resend-otp', validateRequiredFields('email'), resendOtp);

// password flow
router.post(
  '/forgot-password',
  validateRequiredFields('email'),
  forgotPassword
);
router.post(
  '/reset-password',
  validateRequiredFields('email', 'token', 'newPassword'),
  resetPassword
);

// token refresh
router.post(
  '/refresh-token',
  validateRequiredFields('token'),
  refreshToken
);

export default router;
