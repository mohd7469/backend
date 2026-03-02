import { verifyAccessToken } from '../utils/index.js';
import { ErrorResponse } from '../utils/index.js';
import { getAdminById } from '../services/admin.auth.service.js';

export const authenticateAdmin = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ErrorResponse('No token provided', 401));
  }
  const token = header.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    if (decoded.role !== 'admin') {
      return next(new ErrorResponse('Invalid credentials for admin', 401));
    }
    const admin = await getAdminById(decoded.id);
    if (!admin) {
      return next(new ErrorResponse('Admin not found', 404));
    }
    req.user = { id: admin.id, role: admin.role };
    next();
  } catch (err) {
    return next(new ErrorResponse('Invalid token', 401));
  }
};
