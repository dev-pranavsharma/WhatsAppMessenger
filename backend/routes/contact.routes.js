import express from 'express';
import {
  getUserContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  bulkImportContacts,
  getContactTags,
  getContactStats
} from '../controllers/contact.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Contact management routes
 * All routes require authentication
 */
router.use(authMiddleware);

router.get('/', getUserContacts);
router.get('/stats', getContactStats);
router.get('/tags', getContactTags);
router.get('/:id', getContactById);
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);
router.post('/bulk-import', bulkImportContacts);

export default router;