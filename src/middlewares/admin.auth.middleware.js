import { verifyAccessToken } from '../utils/index.js';
import { errors } from '../utils/index.js';
import { getAdminById } from '../services/admin.auth.service.js';

export const authenticateAdmin = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(errors.unauthorized('No token provided'));
  }
  const token = header.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    if (decoded.role !== 'admin') {
      return next(errors.unauthorized('Invalid credentials for admin'));
    }
    const admin = await getAdminById(decoded.id);
    if (!admin) {
      return next(errors.notFound('Admin not found'));
    }
    req.user = { id: admin.id, role: admin.role };
    next();
  } catch (err) {
    return next(errors.unauthorized('Invalid token'));
  }
};
