import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  getActivityLogs,
} from '../controllers/adminController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';

const router = express.Router();

// Strict RBAC: All admin routes require authenticated session with 'admin' role
router.use(requireAuth);
router.use(requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:userId/role', updateUserRole);
router.get('/logs', getActivityLogs);

export default router;
