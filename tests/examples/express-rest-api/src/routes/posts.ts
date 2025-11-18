import { Router } from 'express';
import {
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
} from '../controllers/postController.js';
import { validate, validateUUID, postSchemas } from '../middleware/validation.js';

const router = Router();

/**
 * @route   GET /api/posts
 * @desc    Get all posts (optionally filter by published status)
 * @query   published=true|false
 * @access  Public
 */
router.get('/', getAllPosts);

/**
 * @route   GET /api/posts/:id
 * @desc    Get post by ID
 * @access  Public
 */
router.get('/:id', validateUUID('id'), getPostById);

/**
 * @route   GET /api/posts/author/:authorId
 * @desc    Get all posts by author
 * @access  Public
 */
router.get('/author/:authorId', validateUUID('authorId'), getPostsByAuthor);

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Public
 */
router.post('/', validate(postSchemas.create), createPost);

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a post
 * @access  Public
 */
router.put('/:id', validateUUID('id'), validate(postSchemas.update), updatePost);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post
 * @access  Public
 */
router.delete('/:id', validateUUID('id'), deletePost);

/**
 * @route   POST /api/posts/:id/publish
 * @desc    Publish a post
 * @access  Public
 */
router.post('/:id/publish', validateUUID('id'), publishPost);

/**
 * @route   POST /api/posts/:id/unpublish
 * @desc    Unpublish a post
 * @access  Public
 */
router.post('/:id/unpublish', validateUUID('id'), unpublishPost);

export default router;
