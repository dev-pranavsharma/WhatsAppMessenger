import express from 'express';
import {
  getUserCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  startCampaign,
  getCampaignStats
} from '../controllers/campaign.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Campaign management routes
 * All routes require authentication
 */
router.use(authMiddleware);

router.get('/', getUserCampaigns);
router.get('/:id', getCampaignById);
router.post('/', createCampaign);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);
router.post('/:id/start', startCampaign);
router.get('/:id/stats', getCampaignStats);

export default router;