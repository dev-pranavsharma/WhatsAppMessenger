
import express from 'express';
import { GetCountryCodes } from '@/controllers/library.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Campaign management routes
 * All routes require authentication
 */
router.use(authMiddleware);

router.get('/contacts', GetCountryCodes);


export default router;