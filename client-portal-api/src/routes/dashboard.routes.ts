import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate, authorizeProjectAccess } from '../middleware/auth.middleware';
import { validateParams } from '../middleware/validation.middleware';
import { projectIdParamSchema } from '../schemas/common.schema';

const router = Router();

// All dashboard routes require authentication and project access
router.use(authenticate);

router.get(
  '/projects/:projectId/dashboard/health',
  validateParams(projectIdParamSchema),
  authorizeProjectAccess,
  dashboardController.getProjectHealth.bind(dashboardController)
);

router.get(
  '/projects/:projectId/dashboard/metrics',
  validateParams(projectIdParamSchema),
  authorizeProjectAccess,
  dashboardController.getProjectMetrics.bind(dashboardController)
);

export default router;
