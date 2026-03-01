import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const accessSecret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const accessExpiration = process.env.JWT_EXPIRES_IN || '15m';
const refreshExpiration = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!accessSecret || !refreshSecret) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be defined in environment');
}

export const generateAccessToken = (payload) =>
  jwt.sign(payload, accessSecret, { expiresIn: accessExpiration });

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiration });

export const verifyAccessToken = (token) => jwt.verify(token, accessSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, refreshSecret);
