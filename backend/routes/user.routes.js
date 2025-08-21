import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  registerUser,
  loginUser,
  logoutUser,
  updateWhatsAppConfig,
  getCurrentUser
} from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * User authentication routes
 */
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser);
router.get('/me', authMiddleware, getCurrentUser);
// Refresh endpoint
router.post("/auth/refresh");

/**
 * User profile management routes
 */
router.get('/:id', authMiddleware, getUserProfile);
router.put('/:id', authMiddleware, updateUserProfile);
router.put('/:id/whatsapp', authMiddleware, updateWhatsAppConfig);

export default router;