import { verifyAccessToken } from '../utils/index.js';
import { ErrorResponse } from '../utils/index.js';
import { getUserById } from '../services/userService.js';

export const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ErrorResponse('No token provided', 401));
  }
  const token = header.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    const user = await getUserById(decoded.id);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }
    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    return next(new ErrorResponse('Invalid token', 401));
  }
};