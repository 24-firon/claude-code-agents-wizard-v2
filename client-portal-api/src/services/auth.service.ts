import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../utils/jwt';
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from '../utils/errors';
import { LoginInput, RegisterInput } from '../schemas/auth.schema';
import { UserRole } from '@prisma/client';

export class AuthService {
  async login(input: LoginInput) {
    // Find user with password
    const user = await prisma.user.findUnique({
      where: { email: input.email, deletedAt: null },
      include: { project: true },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isValid = await comparePassword(input.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      projectId: user.projectId || undefined,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      projectId: user.projectId || undefined,
    });

    // Store session
    await prisma.session.create({
      data: {
        userId: user.id,
        accessTokenHash: hashToken(accessToken),
        refreshTokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async register(input: RegisterInput) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(input.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: (input.role as UserRole) || UserRole.USER,
        projectId: input.projectId,
      },
      include: { project: true },
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      projectId: user.projectId || undefined,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      projectId: user.projectId || undefined,
    });

    // Store session
    await prisma.session.create({
      data: {
        userId: user.id,
        accessTokenHash: hashToken(accessToken),
        refreshTokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Find session
    const session = await prisma.session.findFirst({
      where: {
        userId: payload.userId,
        refreshTokenHash: hashToken(refreshToken),
        expiresAt: { gt: new Date() },
      },
      include: { user: { include: { project: true } } },
    });

    if (!session) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      projectId: session.user.projectId || undefined,
    });

    const newRefreshToken = generateRefreshToken({
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      projectId: session.user.projectId || undefined,
    });

    // Update session with new tokens
    await prisma.session.update({
      where: { id: session.id },
      data: {
        accessTokenHash: hashToken(newAccessToken),
        refreshTokenHash: hashToken(newRefreshToken),
        lastActivityAt: new Date(),
      },
    });

    return {
      user: this.sanitizeUser(session.user),
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      // Delete specific session
      await prisma.session.deleteMany({
        where: {
          userId,
          refreshTokenHash: hashToken(refreshToken),
        },
      });
    } else {
      // Delete all user sessions
      await prisma.session.deleteMany({
        where: { userId },
      });
    }
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      include: { project: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}

export const authService = new AuthService();
