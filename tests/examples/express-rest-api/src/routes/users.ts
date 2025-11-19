import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { validate, validateUUID, userSchemas } from '../middleware/validation.js';

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/', getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', validateUUID('id'), getUserById);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post('/', validate(userSchemas.create), createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user
 * @access  Public
 */
router.put('/:id', validateUUID('id'), validate(userSchemas.update), updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user
 * @access  Public
 */
router.delete('/:id', validateUUID('id'), deleteUser);

export default router;
