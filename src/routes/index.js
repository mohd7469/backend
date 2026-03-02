import express from 'express';
import userAuthRoutes from './user.auth.routes.js';
import userProfileRoutes from './user.profile.routes.js';
import adminAuthRoutes from './admin.auth.routes.js';
import adminMgmtRoutes from './admin.management.routes.js';

const router = express.Router();

router.use('/user/auth', userAuthRoutes);
router.use('/user/profile', userProfileRoutes);

router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/management', adminMgmtRoutes);

export default router;
