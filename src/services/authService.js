import bcrypt from 'bcrypt';
import {
  createUser as createUserRecord,
  getUserByEmail,
  updateUser,
} from './userService.js';

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
