import { verifyAccessToken } from '../utils/index.js';
import { errors } from '../utils/index.js';
import { getUserById } from '../services/user.data.service.js';

export const authenticateUser = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(errors.unauthorized('No token provided'));
  }
  const token = header.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    if (decoded.role !== 'user') {
      return next(errors.unauthorized('Invalid credentials for user'));
    }
    const user = await getUserById(decoded.id);
    if (!user) {
      return next(errors.notFound('User not found'));
    }
    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    return next(errors.unauthorized('Invalid token'));
  }
};
