import express from 'express';
import {
  register,
  login,
  refreshToken,
  sendVerificationOtp,
  verifyEmailOtp,
  forgotPassword,
  resetPassword,
} from '../controllers/index.js';
import { validateRequiredFields } from '../../middlewares/index.js';

const router = express.Router();

// user registration/login flows
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

// email verification (two steps: generate & validate OTP)
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

// password recovery (initiate)
router.post(
  '/forgot-password',
  validateRequiredFields('email'),
  forgotPassword
);
// password recovery (finish)
router.post(
  '/reset-password',
  validateRequiredFields('email', 'token', 'newPassword'),
  resetPassword
);

// token refresh (both old and new endpoints)
router.post(
  '/refresh-token',
  validateRequiredFields('token'),
  refreshToken
);
// keep legacy path for now
router.post(
  '/refresh',
  validateRequiredFields('token'),
  refreshToken
);

export default router;
