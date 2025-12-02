import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../schemas/auth.schema';
import * as authService from '../services/auth.service';
import { authMiddleware } from '../middleware/auth';

const auth = new Hono();

// POST /auth/login
auth.post('/login', zValidator('json', loginSchema), async (c) => {
  const input = c.req.valid('json');
  const result = await authService.login(input);

  return c.json({
    success: true,
    data: result,
  });
});

// POST /auth/register
auth.post('/register', zValidator('json', registerSchema), async (c) => {
  const input = c.req.valid('json');
  const result = await authService.register(input);

  return c.json({
    success: true,
    data: result,
  }, 201);
});

// POST /auth/refresh
auth.post('/refresh', zValidator('json', refreshTokenSchema), async (c) => {
  const { refreshToken } = c.req.valid('json');
  const tokens = await authService.refreshTokens(refreshToken);

  return c.json({
    success: true,
    data: tokens,
  });
});

// POST /auth/logout
auth.post('/logout', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const refreshToken = body.refreshToken;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  return c.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// GET /auth/me (protected)
auth.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');
  const fullUser = await authService.getCurrentUser(user.sub);

  return c.json({
    success: true,
    data: fullUser,
  });
});

// PATCH /auth/me (protected)
auth.patch('/me', authMiddleware, zValidator('json', updateProfileSchema), async (c) => {
  const user = c.get('user');
  const input = c.req.valid('json');
  const updatedUser = await authService.updateProfile(user.sub, input);

  return c.json({
    success: true,
    data: updatedUser,
  });
});

// POST /auth/change-password (protected)
auth.post('/change-password', authMiddleware, zValidator('json', changePasswordSchema), async (c) => {
  const user = c.get('user');
  const { currentPassword, newPassword } = c.req.valid('json');
  await authService.changePassword(user.sub, currentPassword, newPassword);

  return c.json({
    success: true,
    message: 'Password changed successfully. Please log in again.',
  });
});

// POST /auth/logout-all (protected)
auth.post('/logout-all', authMiddleware, async (c) => {
  const user = c.get('user');
  await authService.logoutAll(user.sub);

  return c.json({
    success: true,
    message: 'Logged out from all devices',
  });
});

export { auth };
