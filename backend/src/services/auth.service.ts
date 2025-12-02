import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, JWTPayload } from '../utils/jwt';
import { LoginInput, RegisterInput } from '../schemas/auth.schema';
import { HTTPException } from 'hono/http-exception';
import { SafeUser, AuthTokens } from '../types';

export async function login(input: LoginInput): Promise<{ user: SafeUser; tokens: AuthTokens }> {
  const { email, password } = input;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: { project: true },
  });

  if (!user) {
    throw new HTTPException(401, { message: 'Invalid email or password' });
  }

  // Verify password
  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw new HTTPException(401, { message: 'Invalid email or password' });
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate tokens
  const jwtPayload: JWTPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    projectId: user.projectId || undefined,
  };

  const accessToken = await generateAccessToken(jwtPayload);
  const refreshToken = await generateRefreshToken(user.id);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // Return safe user (without password)
  const { passwordHash, ...safeUser } = user;

  return {
    user: safeUser,
    tokens: { accessToken, refreshToken },
  };
}

export async function register(input: RegisterInput): Promise<{ user: SafeUser; tokens: AuthTokens }> {
  const { email, password, firstName, lastName, projectId } = input;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new HTTPException(409, { message: 'User with this email already exists' });
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      projectId,
      role: 'VIEWER', // Default role
    },
    include: { project: true },
  });

  // Generate tokens
  const jwtPayload: JWTPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    projectId: user.projectId || undefined,
  };

  const accessToken = await generateAccessToken(jwtPayload);
  const refreshToken = await generateRefreshToken(user.id);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const { passwordHash: _, ...safeUser } = user;

  return {
    user: safeUser,
    tokens: { accessToken, refreshToken },
  };
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  // Verify refresh token
  let userId: string;
  try {
    userId = await verifyRefreshToken(refreshToken);
  } catch {
    throw new HTTPException(401, { message: 'Invalid refresh token' });
  }

  // Check if token exists and is not revoked
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
    throw new HTTPException(401, { message: 'Invalid or expired refresh token' });
  }

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new HTTPException(401, { message: 'User not found' });
  }

  // Revoke old token
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revoked: true },
  });

  // Generate new tokens
  const jwtPayload: JWTPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    projectId: user.projectId || undefined,
  };

  const newAccessToken = await generateAccessToken(jwtPayload);
  const newRefreshToken = await generateRefreshToken(user.id);

  // Store new refresh token
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logout(refreshToken: string): Promise<void> {
  // Revoke the refresh token
  await prisma.refreshToken.updateMany({
    where: { token: refreshToken },
    data: { revoked: true },
  });
}

export async function logoutAll(userId: string): Promise<void> {
  // Revoke all refresh tokens for user
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
}

export async function getCurrentUser(userId: string): Promise<SafeUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { project: true },
  });

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function updateProfile(
  userId: string,
  data: { firstName?: string; lastName?: string; avatarUrl?: string | null }
): Promise<SafeUser> {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    include: { project: true },
  });

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  // Verify current password
  const isValid = await comparePassword(currentPassword, user.passwordHash);
  if (!isValid) {
    throw new HTTPException(400, { message: 'Current password is incorrect' });
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  // Revoke all refresh tokens (force re-login)
  await logoutAll(userId);
}
