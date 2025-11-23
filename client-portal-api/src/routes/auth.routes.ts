import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimit.middleware';
import { csrfProtection } from '../middleware/csrf.middleware';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { auditLog } from '../middleware/audit.middleware';

const router = Router();

// Public routes with rate limiting
router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  auditLog('LOGIN', 'User'),
  authController.login.bind(authController)
);

router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  authController.register.bind(authController)
);

router.post(
  '/refresh',
  authRateLimiter,
  csrfProtection,
  authController.refresh.bind(authController)
);

// Protected routes
router.post(
  '/logout',
  authenticate,
  auditLog('LOGOUT', 'User'),
  authController.logout.bind(authController)
);

router.get(
  '/me',
  authenticate,
  authController.me.bind(authController)
);

export default router;
