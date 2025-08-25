import express from 'express';
import {GetContacts} from '../controllers/contact.controller.js'
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Contact management routes
 * All routes require authentication
 */
router.use(authMiddleware);

router.get(':/tenant_id/:waba_id/contacts', GetContacts);
// router.get('/stats', getContactStats);
// router.get('/tags', getContactTags);
// router.get('/:id', getContactById);
// router.post('/', createContact);
// router.put('/:id', updateContact);
// router.delete('/:id', deleteContact);
// router.post('/bulk-import', bulkImportContacts);

export default router;