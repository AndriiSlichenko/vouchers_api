import { Router } from 'express';
import { validate, validateParams, validateQuery } from '../middleware/validation';
import {
	campaignIdSchema,
	generateVouchersSchema,
	listVouchersSchema
} from '../validation/schemas';
import {
	createVouchersForCampaign,
	downloadVouchersForCampaign,
	getVouchersForCampaign,
} from '../controllers/vouchers';

const router = Router();

// Create vouchers for campaign
router.post(
	'/:id/vouchers',
	validateParams(campaignIdSchema),
	validate(generateVouchersSchema),
	createVouchersForCampaign
);
// Get vouchers for a specific campaign
router.get(
	'/:id/vouchers',
	validateParams(campaignIdSchema),
	validateQuery(listVouchersSchema),
	getVouchersForCampaign
);
// Download vouchers as CSV
router.get(
	'/:id/vouchers/download',
	validateParams(campaignIdSchema),
	downloadVouchersForCampaign
);

export default router;