import { Request, Response } from 'express';
import { CampaignService } from '../services/campaign.service';
import { ModifiedRequest } from '../types';

const campaignService = new CampaignService();

export const createCampaign = async (req: Request, res: Response) => {
	try {
		const campaign = await campaignService.createCampaign(req.body);

		res.status(201).json({
			success: true,
			message: 'Campaign created successfully',
			data: campaign.dataValues,
		});
	} catch (error) {
		console.error('Error creating campaign:', error);

		res.status(500).json({
			success: false,
			message: 'Failed to create campaign',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const getCampaigns = async (req: ModifiedRequest, res: Response) => {
    try {
		const { page, limit } = req.validatedQuery as { page?: number; limit?: number };
		const result = await campaignService.getCampaigns(Number(page), Number(limit));

		res.json({
			success: true,
			data: result.campaigns,
			pagination: result.pagination,
		});
	} catch (error) {
		console.error('Error fetching campaigns:', error);

		res.status(500).json({
			success: false,
			message: 'Failed to fetch campaigns',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const getCampaign = async (req: ModifiedRequest, res: Response) => {
    try {
        const campaignId = Number(req.params.id);
		const campaign = await campaignService.getCampaignById(campaignId);

		if (!campaign) {
			return res.status(404).json({
				success: false,
				message: 'Campaign not found',
			});
		}

		res.json({
			success: true,
			data: campaign,
		});
	} catch (error) {
		console.error('Error fetching campaign:', error);

		res.status(500).json({
			success: false,
			message: 'Failed to fetch campaign',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};

export const deleteCampaign = async (req: ModifiedRequest, res: Response) => {
    try {
        const campaignId = Number(req.params.id);
		const deleted = await campaignService.deleteCampaign(campaignId);

		if (!deleted) {
			return res.status(404).json({
				success: false,
				message: 'Campaign not found',
			});
		}

		res.json({
			success: true,
			message: 'Campaign deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting campaign:', error);
		
		res.status(500).json({
			success: false,
			message: 'Failed to delete campaign',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};
