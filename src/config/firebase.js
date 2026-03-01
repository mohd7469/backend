import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

/**
 * The FIREBASE_SERVICE_ACCOUNT environment variable should contain a JSON-stringified
 * service account credential object. This keeps secrets out of the repository and allows
 * different environments to supply their own credentials.
 */
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
} catch (err) {
  console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', err.message);
  process.exit(1);
}

if (!serviceAccount || Object.keys(serviceAccount).length === 0) {
  throw new Error('Missing or invalid FIREBASE_SERVICE_ACCOUNT in environment');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
