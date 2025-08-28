
import express from 'express';
import { GetCountryCodes, GetGenders } from '@/controllers/library.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Campaign management routes
 * All routes require authentication
 */
router.use(authMiddleware);

router.get('/countryCodes', GetCountryCodes);
router.get('/genders', GetGenders)


export default router;