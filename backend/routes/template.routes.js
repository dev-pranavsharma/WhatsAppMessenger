import express from 'express';
import { GetAllTemplates } from '../controllers/template.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/:waba_id/all', GetAllTemplates);
// router.get('/categories', getTemplateCategories);
// router.get('/:id', getTemplateById);
// router.post('/', createTemplate);
// router.put('/:id', updateTemplate);
// router.delete('/:id', deleteTemplate);
// router.post('/:id/submit', submitTemplateForApproval);
// router.post('/:id/preview', previewTemplate);

export default router;