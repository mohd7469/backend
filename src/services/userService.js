import { db } from '../config/firebase.js';

const usersRef = db.collection('users');

export const createUser = async (userData) => {
  const ref = await usersRef.add(userData);
  const snap = await ref.get();
  return { id: snap.id, ...snap.data() };
};

export const getUserById = async (id) => {
  const snap = await usersRef.doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
};

// NOTE: bcrypt imported once at the top of the file
export const getUserByEmail = async (email) => {
  const query = await usersRef.where('email', '==', email).limit(1).get();
  if (query.empty) return null;
  const doc = query.docs[0];
  return { id: doc.id, ...doc.data() };
};

// SALT_ROUNDS used when hashing passwords during updates
const SALT_ROUNDS = 10;

export const updateUser = async (id, updates) => {
  // if password is being changed, hash it before saving
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
  }
  await usersRef.doc(id).update(updates);
  return getUserById(id);
};

export const deleteUser = async (id) => {
  await usersRef.doc(id).delete();
};

export const listUsers = async () => {
  const snapshot = await usersRef.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
