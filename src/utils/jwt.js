import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const accessSecret = env.JWT_SECRET;
const refreshSecret = env.JWT_REFRESH_SECRET;
const accessExpiration = env.JWT_EXPIRES_IN;
const refreshExpiration = env.JWT_REFRESH_EXPIRES_IN;

if (!accessSecret || !refreshSecret) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined in environment');
}

export const generateAccessToken = (payload) =>
  jwt.sign(payload, accessSecret, { expiresIn: accessExpiration });

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiration });

export const verifyAccessToken = (token) => jwt.verify(token, accessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, refreshSecret);
