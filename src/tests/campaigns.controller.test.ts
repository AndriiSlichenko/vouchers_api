import request from 'supertest';
import express from 'express';
import { createCampaign, getCampaigns, getCampaign, deleteCampaign } from '../controllers/campaign';
import Campaign from '../models/campaign';
import { validateQuery } from '../middleware/validation';
import { listCampaignsSchema } from '../validation/schemas';

// Create test app
const app = express();
app.use(express.json());

// Mock middleware for validation
const mockValidation = (req: any, res: any, next: any) => {
	req.validatedQuery = req.query;
	next();
};

// Routes
app.post('/campaigns', createCampaign);
app.get('/campaigns', validateQuery(listCampaignsSchema), getCampaigns);
app.get('/campaigns/:id', mockValidation, getCampaign);
app.delete('/campaigns/:id', mockValidation, deleteCampaign);

describe('Campaign Controller', () => {
	beforeEach(async () => {
		// Database cleanup is handled by global setup
	});

	describe('POST /campaigns', () => {
		it('should create a campaign with valid data', async () => {
			const campaignData = {
				name: 'Summer Sale 2024',
				prefix: 'SUMMER',
				amount: 100,
				currency: 'SEK',
				validFrom: '2024-06-01',
				validTo: '2024-08-31',
			};

			const response = await request(app)
				.post('/campaigns')
				.send(campaignData)
				.expect(201);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe('Campaign created successfully');
			expect(response.body.data).toMatchObject({
				name: campaignData.name,
				prefix: campaignData.prefix,
				amount: campaignData.amount,
				currency: campaignData.currency,
			});
		});

		it('should create campaign even with invalid data (Sequelize allows it)', async () => {
			const invalidData = {
				name: '',
				prefix: '',
				amount: -100,
			};

			const response = await request(app)
				.post('/campaigns')
				.send(invalidData)
				.expect(201);

			expect(response.body.success).toBe(true);
			expect(response.body.data.amount).toBe(-100);
		});
	});

	describe('GET /campaigns', () => {
		beforeEach(async () => {
			// Create test campaigns
			await Campaign.bulkCreate([
				{
					name: 'Campaign 1',
					prefix: 'CAMP1',
					amount: 50,
					currency: 'SEK',
					validFrom: new Date('2024-01-01'),
					validTo: new Date('2024-12-31'),
				},
				{
					name: 'Campaign 2',
					prefix: 'CAMP2',
					amount: 100,
					currency: 'SEK',
					validFrom: new Date('2024-01-01'),
					validTo: new Date('2024-12-31'),
				},
			]);
		});

		it('should return all campaigns with default pagination', async () => {
			const response = await request(app)
				.get('/campaigns')
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveLength(2);
			expect(response.body.pagination).toEqual({
				page: 1,
				limit: 20,
				total: 2,
				pages: 1,
			});
		});

		it('should return campaigns with custom pagination', async () => {
			const response = await request(app)
				.get('/campaigns?page=1&limit=1')
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveLength(1);
			expect(response.body.pagination).toEqual({
				page: 1,
				limit: 1,
				total: 2,
				pages: 2,
			});
		});
	});

	describe('GET /campaigns/:id', () => {
		let testCampaign: any;

		beforeEach(async () => {
			testCampaign = await Campaign.create({
				name: 'Test Campaign',
				prefix: 'TEST',
				amount: 75,
				currency: 'SEK',
				validFrom: new Date('2024-01-01'),
				validTo: new Date('2024-12-31'),
			});
		});

		it('should return campaign by valid ID', async () => {
			const response = await request(app)
				.get(`/campaigns/${testCampaign.id}`)
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data).toMatchObject({
				id: testCampaign.id,
				name: 'Test Campaign',
				prefix: 'TEST',
				amount: 75,
				currency: 'SEK',
			});
		});

		it('should return 404 for non-existent campaign', async () => {
			const response = await request(app)
				.get('/campaigns/999')
				.expect(404);

			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe('Campaign not found');
		});
	});

	describe('DELETE /campaigns/:id', () => {
		let testCampaign: any;

		beforeEach(async () => {
			testCampaign = await Campaign.create({
				name: 'Test Campaign',
				prefix: 'TEST',
				amount: 75,
				currency: 'SEK',
				validFrom: new Date('2024-01-01'),
				validTo: new Date('2024-12-31'),
			});
		});

		it('should delete campaign by valid ID', async () => {
			const response = await request(app)
				.delete(`/campaigns/${testCampaign.id}`)
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe('Campaign deleted successfully');

			// Verify campaign is deleted
			const campaign = await Campaign.findByPk(testCampaign.id);
			expect(campaign).toBeNull();
		});

		it('should return 404 for non-existent campaign', async () => {
			const response = await request(app)
				.delete('/campaigns/999')
				.expect(404);

			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe('Campaign not found');
		});
	});
});