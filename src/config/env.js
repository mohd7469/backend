import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always load .env from backend root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  APP_NAME: process.env.APP_NAME,
  APP_ENV: process.env.APP_ENV || 'demo',
  PORT: process.env.PORT || 5000,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'default_access_secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
  JWT_ACCESS_EXPIRE_IN: process.env.JWT_ACCESS_EXPIRE_IN || '15m',
  JWT_REFRESH_EXPIRE_IN: process.env.JWT_REFRESH_EXPIRE_IN || '1d',

  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'vOVH6sdmpNWjRRIqCc7rdxs01lwBzfrY', // Must be 32 chars
  ENCRYPTION_IV: process.env.ENCRYPTION_IV || 'e977014697305d26', // Must be 16 chars

  FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
  FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
  
  CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(url => url.trim()) : null,
  
  LINK_AND_OTP_EXPIRY_MINUTES: parseInt(process.env.LINK_AND_OTP_EXPIRY_MINUTES) || 3,
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  ADMIN_ORIGIN: process.env.ADMIN_ORIGIN
};

// Validate required environment variables
const requiredEnvVars = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Validate at least one Firebase credential method is provided
if (!env.FIREBASE_SERVICE_ACCOUNT_PATH && !env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  throw new Error('Either FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON must be provided');
}
