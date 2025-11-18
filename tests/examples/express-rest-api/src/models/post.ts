import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePostData {
  title: string;
  content?: string;
  published?: boolean;
  authorId: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
}

export class PostModel {
  /**
   * Get all posts
   */
  static async findAll(published?: boolean) {
    const where = published !== undefined ? { published } : {};

    return prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get post by ID
   */
  static async findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Get posts by author
   */
  static async findByAuthor(authorId: string) {
    return prisma.post.findMany({
      where: { authorId },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Create a new post
   */
  static async create(data: CreatePostData) {
    return prisma.post.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Update a post
   */
  static async update(id: string, data: UpdatePostData) {
    return prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Delete a post
   */
  static async delete(id: string) {
    return prisma.post.delete({
      where: { id },
    });
  }

  /**
   * Check if post exists
   */
  static async exists(id: string): Promise<boolean> {
    const count = await prisma.post.count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * Publish a post
   */
  static async publish(id: string) {
    return prisma.post.update({
      where: { id },
      data: { published: true },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Unpublish a post
   */
  static async unpublish(id: string) {
    return prisma.post.update({
      where: { id },
      data: { published: false },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }
}
