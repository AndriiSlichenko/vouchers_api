import { Router } from 'express';
import { validate, validateParams, validateQuery } from '../middleware/validation';
import {
	createCampaignSchema,
	campaignIdSchema,
	listCampaignsSchema,
} from '../validation/schemas';
import {
	createCampaign,
	deleteCampaign,
	getCampaigns,
	getCampaign,
} from '../controllers/campaign';

const router = Router();

// Create a new campaign
router.post('/', validate(createCampaignSchema), createCampaign);
// Get all campaigns
router.get('/', validateQuery(listCampaignsSchema), getCampaigns);
// Get a specific campaign
router.get('/:id', validateParams(campaignIdSchema), getCampaign);
// Delete a campaign
router.delete('/:id', validateParams(campaignIdSchema), deleteCampaign);

export default router;
