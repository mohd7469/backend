import {
  registerUser,
  validateCredentials,
  saveRefreshToken,
  clearRefreshToken,
  getUserByRefreshToken,
  generateEmailOtp,
  resendOtp as resendOtpService,
  validateEmailOtp,
  generatePasswordResetToken,
  resetPasswordWithToken,
} from '../services/user.auth.service.js';
import { getUserById } from '../services/user.data.service.js';
import { sendVerificationOtpEmail, sendPasswordResetLink, sendWelcomeEmail } from '../services/emailService.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/index.js';
import { ErrorResponse } from '../utils/index.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser({ name, email, password });
    // Send welcome email
    sendWelcomeEmail(email, name).catch(console.error);
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

// ------------------------------------------------------------------
// new endpoints for OTP and password recovery
// ------------------------------------------------------------------

export const sendVerificationOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = await generateEmailOtp(email);
    // Send OTP via email
    await sendVerificationOtpEmail(email, otp);
    res.json({ success: true, message: 'Verification OTP sent to email' });
  } catch (err) {
    next(err);
  }
};

export const verifyEmailOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const ok = await validateEmailOtp(email, otp);
    if (!ok) {
      return next(new ErrorResponse('Invalid or expired OTP', 400));
    }
    res.json({ success: true, message: 'Email verified' });
  } catch (err) {
    next(err);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = await resendOtpService(email);
    await sendVerificationOtpEmail(email, otp);
    res.json({ success: true, message: 'OTP resent to email' });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = await generatePasswordResetToken(email);
    // Send reset link via email (uses FRONTEND_URL as base)
    await sendPasswordResetLink(email, token);
    res.json({ success: true, message: 'Password reset link sent to email' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;
    const ok = await resetPasswordWithToken(email, token, newPassword);
    if (!ok) {
      return next(new ErrorResponse('Invalid or expired reset token', 400));
    }
    res.json({ success: true, message: 'Password has been reset' });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await clearRefreshToken(req.user.id);
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

