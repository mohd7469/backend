import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '..');

const loadCredential = () => {
  // Priority 1: Load from JSON string (production)
  if (env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
    return admin.credential.cert(serviceAccount);
  }

  // Priority 2: Load from file path (local development)
  if (env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccountPath = path.resolve(backendRoot, env.FIREBASE_SERVICE_ACCOUNT_PATH);
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    return admin.credential.cert(serviceAccount);
  }

  // Priority 3: Use Application Default Credentials (Google Cloud)
  return admin.credential.applicationDefault();
};

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  try {
    const credential = loadCredential();
    admin.initializeApp({ credential });
    console.log('✓ Firebase initialized successfully');
  } catch (error) {
    console.error('✗ Firebase initialization failed:', error.message);
    process.exit(1);
  }
}

export const db = admin.firestore();
