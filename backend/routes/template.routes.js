import express from 'express';
import {
  getUserTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  submitTemplateForApproval,
  getTemplateCategories,
  previewTemplate
} from '../controllers/template.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Template management routes
 * All routes require authentication
 */
router.use(authMiddleware);

router.get('/', getUserTemplates);
router.get('/categories', getTemplateCategories);
router.get('/:id', getTemplateById);
router.post('/', createTemplate);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);
router.post('/:id/submit', submitTemplateForApproval);
router.post('/:id/preview', previewTemplate);

export default router;