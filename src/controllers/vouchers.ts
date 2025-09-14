import { Response } from 'express';
import { CampaignService } from '../services/campaign.service';
import { ModifiedRequest } from '../types';
import { generateVoucherCsvInMemory } from '../utils.ts/csvGenerator';

const campaignService = new CampaignService();

export const createVouchersForCampaign = async (req: ModifiedRequest, res: Response) => {
    try {
        const campaignId = Number(req.params.id);
        const { count } = req.body;

        const campaign = await campaignService.getCampaignById(campaignId);

		if (!campaign) {
			throw new Error('Campaign not found');
		}

        const insertedCount = await campaignService.generateVouchers(campaignId, count);
        
        res.status(201).json({
            success: true,
            message: `${insertedCount} vouchers generated successfully`,
            data: {
                count,
                campaignId,
            },
        });
    } catch (error) {
        console.error('Error generating vouchers:', error);
        
        res.status(500).json({
            success: false,
            message: 'Failed to generate vouchers',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const getVouchersForCampaign = async (req: ModifiedRequest, res: Response) => {
    try {
        const campaignId = Number(req.params.id);
        const { page, limit } = req.validatedQuery as { page: number, limit: number };

        const campaign = await campaignService.getCampaignById(campaignId);

        if (!campaign) {
			return res.status(404).json({
				success: false,
				message: 'Campaign not found',
			});
		}

        const result = await campaignService.getVouchers(campaignId, campaign.prefix, Number(page), Number(limit));
        
        res.json({
            success: true,
            data: result.vouchers,
            pagination: result.pagination,
        });
    } catch (error) {
        console.error('Error fetching vouchers:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch vouchers',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const downloadVouchersForCampaign = async (req: ModifiedRequest, res: Response) => {
    try {
		const campaignId = Number(req.params.id);

		const campaign = await campaignService.getCampaignById(campaignId);

		if (!campaign) {
			return res.status(404).json({
				success: false,
				message: 'Campaign not found',
			});
		}

        const { name, prefix } = campaign;

		const vouchers = await campaignService.getAllVouchersForCampaign(campaignId, prefix);
        
		if (vouchers.length === 0) {
			return res.status(404).json({
				success: false,
				message: 'No vouchers found for this campaign',
			});
		}

		const csvContent = generateVoucherCsvInMemory(vouchers);

		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', `attachment; filename="${name}-vouchers.csv"`);

		res.send(csvContent);
	} catch (error) {
		console.error('Error downloading vouchers:', error);

		res.status(500).json({
			success: false,
			message: 'Failed to download vouchers',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};
