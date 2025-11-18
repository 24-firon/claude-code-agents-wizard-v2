import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateUserData {
  email: string;
  name: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
}

export class UserModel {
  /**
   * Get all users
   */
  static async findAll() {
    return prisma.user.findMany({
      include: {
        posts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get user by ID
   */
  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });
  }

  /**
   * Get user by email
   */
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        posts: true,
      },
    });
  }

  /**
   * Create a new user
   */
  static async create(data: CreateUserData) {
    return prisma.user.create({
      data,
      include: {
        posts: true,
      },
    });
  }

  /**
   * Update a user
   */
  static async update(id: string, data: UpdateUserData) {
    return prisma.user.update({
      where: { id },
      data,
      include: {
        posts: true,
      },
    });
  }

  /**
   * Delete a user
   */
  static async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Check if user exists
   */
  static async exists(id: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { id },
    });
    return count > 0;
  }
}
