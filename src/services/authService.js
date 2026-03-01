import bcrypt from 'bcrypt';
import {
  createUser as createUserRecord,
  getUserByEmail,
  updateUser,
} from './userService.js';
import { env } from '../config/env.js';

const SALT_ROUNDS = 10;

export const registerUser = async ({ name, email, password, role = 'user' }) => {
  const existing = await getUserByEmail(email);
  if (existing) {
    const err = new Error('Email already in use');
    err.statusCode = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  return createUserRecord({ name, email, password: hashed, role });
};

export const validateCredentials = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  return match ? user : null;
};

export const saveRefreshToken = async (userId, token) => {
  await updateUser(userId, { refreshToken: token });
};

import { db } from '../config/firebase.js';
import crypto from 'crypto';

// find the user who currently holds a given refresh token
export const getUserByRefreshToken = async (token) => {
  const snapshot = await db
    .collection('users')
    .where('refreshToken', '==', token)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

// ------------------------------------------------------------------
// helpers for OTP / token flows
// ------------------------------------------------------------------

const time = parseInt(env.LINK_AND_OTP_EXPIRY_MINUTES, 10);
const OTP_TTL = time * 60 * 1000; // minutes -> ms

function makeOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// password reset link expiry uses same LINK_AND_OTP_EXPIRY_MINUTES (minutes)

export const generateEmailOtp = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  const otp = makeOtp();
  const hashed = await bcrypt.hash(otp, SALT_ROUNDS);
  const expires = Date.now() + OTP_TTL;
  await updateUser(user.id, { emailOtp: hashed, emailOtpExpires: expires });
  return otp;
};

export const validateEmailOtp = async (email, otp) => {
  const user = await getUserByEmail(email);
  if (!user || !user.emailOtp || !user.emailOtpExpires) return false;
  if (user.emailOtpExpires < Date.now()) return false;
  const match = await bcrypt.compare(otp, user.emailOtp);
  if (match) {
    await updateUser(user.id, { emailOtp: null, emailOtpExpires: null, emailVerified: true });
  }
  return match;
};

export const generatePasswordResetToken = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  // generate a random token and store a hashed version
  const token = crypto.randomBytes(32).toString('hex');
  const hashed = await bcrypt.hash(token, SALT_ROUNDS);
  const expires = Date.now() + LINK_AND_OTP_EXPIRY_MINUTES * 60 * 1000;
  await updateUser(user.id, { resetToken: hashed, resetTokenExpires: expires });
  return token;
};

export const resetPasswordWithToken = async (email, token, newPassword) => {
  const user = await getUserByEmail(email);
  if (!user || !user.resetToken || !user.resetTokenExpires) return false;
  if (user.resetTokenExpires < Date.now()) return false;
  const match = await bcrypt.compare(token, user.resetToken);
  if (!match) return false;
  const hashedPass = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await updateUser(user.id, { password: hashedPass, resetToken: null, resetTokenExpires: null });
  return true;
};
