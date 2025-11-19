import { Request, Response } from 'express';
import { PostModel } from '../models/post.js';
import { UserModel } from '../models/user.js';

/**
 * Get all posts
 */
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { published } = req.query;
    const publishedFilter = published === 'true' ? true : published === 'false' ? false : undefined;

    const posts = await PostModel.findAll(publishedFilter);

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get post by ID
 */
export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await PostModel.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
        message: `Post with ID ${id} does not exist`,
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch post',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get posts by author
 */
export const getPostsByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;

    // Check if author exists
    const author = await UserModel.exists(authorId);
    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found',
        message: `User with ID ${authorId} does not exist`,
      });
    }

    const posts = await PostModel.findByAuthor(authorId);

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching posts by author:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Create a new post
 */
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, published, authorId } = req.body;

    // Check if author exists
    const author = await UserModel.exists(authorId);
    if (!author) {
      return res.status(404).json({
        success: false,
        error: 'Author not found',
        message: `User with ID ${authorId} does not exist`,
      });
    }

    const post = await PostModel.create({
      title,
      content,
      published: published || false,
      authorId,
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create post',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Update a post
 */
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if post exists
    const exists = await PostModel.exists(id);
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
        message: `Post with ID ${id} does not exist`,
      });
    }

    const post = await PostModel.update(id, updates);

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update post',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Delete a post
 */
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if post exists
    const exists = await PostModel.exists(id);
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
        message: `Post with ID ${id} does not exist`,
      });
    }

    await PostModel.delete(id);

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete post',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Publish a post
 */
export const publishPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const exists = await PostModel.exists(id);
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
        message: `Post with ID ${id} does not exist`,
      });
    }

    const post = await PostModel.publish(id);

    res.json({
      success: true,
      message: 'Post published successfully',
      data: post,
    });
  } catch (error) {
    console.error('Error publishing post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish post',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Unpublish a post
 */
export const unpublishPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const exists = await PostModel.exists(id);
    if (!exists) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
        message: `Post with ID ${id} does not exist`,
      });
    }

    const post = await PostModel.unpublish(id);

    res.json({
      success: true,
      message: 'Post unpublished successfully',
      data: post,
    });
  } catch (error) {
    console.error('Error unpublishing post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unpublish post',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
