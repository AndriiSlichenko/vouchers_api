import { sequelizeConnection } from '../db/config';
import { CampaignService } from '../services/campaign.service';
import Campaign from '../models/campaign';
import Voucher from '../models/voucher';

describe('CampaignService', () => {
	const db = sequelizeConnection;
	const campaignService = new CampaignService();

	// Before any tests run, clear the DB and run migrations with Sequelize sync()
	beforeEach(async () => {
		await db.sync({ force: true });
	});

	afterAll(async () => {
		await db.close();
	});

	describe('createCampaign', () => {
		it('should create a campaign with valid data', async () => {
			const campaignData = {
				name: 'Summer Sale 2024',
				prefix: 'SUMMER',
				amount: 100,
				currency: 'SEK',
				validFrom: new Date('2024-06-01'),
				validTo: new Date('2024-08-31'),
			};

			const campaign = await campaignService.createCampaign(campaignData);

			expect(campaign).toBeDefined();
			expect(campaign.name).toBe(campaignData.name);
			expect(campaign.prefix).toBe(campaignData.prefix);
			expect(campaign.amount).toBe(campaignData.amount);
			expect(campaign.currency).toBe(campaignData.currency);
			expect(campaign.validFrom).toEqual(campaignData.validFrom);
			expect(campaign.validTo).toEqual(campaignData.validTo);
			expect(campaign.id).toBeDefined();
		});

		it('should create campaign even with invalid data (Sequelize allows it)', async () => {
			const invalidData = {
				name: '',
				prefix: '',
				amount: -100,
				currency: '',
				validFrom: new Date('2024-08-31'),
				validTo: new Date('2024-06-01'), // Invalid: end date before start date
			};

			const campaign = await campaignService.createCampaign(invalidData);
			expect(campaign).toBeDefined();
			expect(campaign.amount).toBe(-100);
		});
	});

	describe('getCampaigns', () => {
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
				{
					name: 'Campaign 3',
					prefix: 'CAMP3',
					amount: 150,
					currency: 'SEK',
					validFrom: new Date('2024-01-01'),
					validTo: new Date('2024-12-31'),
				},
			]);
		});

		it('should return all campaigns with default pagination', async () => {
			const result = await campaignService.getCampaigns();

			expect(result.campaigns).toHaveLength(3);
			expect(result.pagination).toEqual({
				page: 1,
				limit: 20,
				total: 3,
				pages: 1,
			});
		});

		it('should return campaigns with custom pagination', async () => {
			const result = await campaignService.getCampaigns(1, 2);

			expect(result.campaigns).toHaveLength(2);
			expect(result.pagination).toEqual({
				page: 1,
				limit: 2,
				total: 3,
				pages: 2,
			});
		});

		it('should return empty result for non-existent page', async () => {
			const result = await campaignService.getCampaigns(10, 10);

			expect(result.campaigns).toHaveLength(0);
			expect(result.pagination.total).toBe(3);
		});
	});

	describe('getCampaignById', () => {
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
			const campaign = await campaignService.getCampaignById(testCampaign.id);

			expect(campaign).toBeDefined();
			expect(campaign?.id).toBe(testCampaign.id);
			expect(campaign?.name).toBe('Test Campaign');
		});

		it('should return null for non-existent ID', async () => {
			const campaign = await campaignService.getCampaignById(999);

			expect(campaign).toBeNull();
		});
	});

	describe('deleteCampaign', () => {
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
			const deleted = await campaignService.deleteCampaign(testCampaign.id);

			expect(deleted).toBe(1); // Sequelize returns number of deleted rows

			// Verify campaign is deleted
			const campaign = await Campaign.findByPk(testCampaign.id);
			expect(campaign).toBeNull();
		});

		it('should return 0 for non-existent ID', async () => {
			const deleted = await campaignService.deleteCampaign(999);

			expect(deleted).toBe(0);
		});
	});

	describe('generateVouchers', () => {
		let testCampaign: any;

		beforeEach(async () => {
			testCampaign = await Campaign.create({
				name: 'Test Campaign',
				prefix: 'TEST',
				amount: 100,
				currency: 'SEK',
				validFrom: new Date('2024-01-01'),
				validTo: new Date('2024-12-31'),
			});
		});

		it('should generate vouchers for valid campaign', async () => {
			const count = 5;
			await campaignService.generateVouchers(testCampaign.id, count);
			const result = await campaignService.getVouchers(testCampaign.id, testCampaign.prefix, 1, 100_000);
			const vouchers = result.vouchers;
			expect(vouchers).toHaveLength(count);
			// Check that all vouchers have the correct prefix
			vouchers.forEach((voucher: { code: string }) => {
				expect(voucher.code).toMatch(new RegExp(`^${testCampaign.prefix}`));
			});
		});

		it('should generate unique voucher codes', async () => {
			const count = 100;
			await campaignService.generateVouchers(testCampaign.id, count);

			const vouchers = await Voucher.findAll({ where: { campaignId: testCampaign.id } });
			const codes = vouchers.map(v => v.code);
			const uniqueCodes = new Set(codes);

			expect(uniqueCodes.size).toBe(codes.length);
		});
	});

	describe('getVouchers', () => {
		let testCampaign: any;

		beforeEach(async () => {
			testCampaign = await Campaign.create({
				name: 'Test Campaign',
				prefix: 'TEST',
				amount: 100,
				currency: 'SEK',
				validFrom: new Date('2024-01-01'),
				validTo: new Date('2024-12-31'),
			});

			// Generate test vouchers
			await campaignService.generateVouchers(testCampaign.id, 25);
		});

		it('should return vouchers with default pagination', async () => {
			const result = await campaignService.getVouchers(testCampaign.id, testCampaign.prefix);

			expect(result.vouchers).toHaveLength(25);
			expect(result.pagination).toEqual({
				page: 1,
				limit: 50,
				total: 25,
				pages: 1,
			});
		});

		it('should return vouchers with custom pagination', async () => {
			const result = await campaignService.getVouchers(testCampaign.id, testCampaign.prefix, 1, 10);

			expect(result.vouchers).toHaveLength(10);
			expect(result.pagination).toEqual({
				page: 1,
				limit: 10,
				total: 25,
				pages: 3,
			});
		});

		it('should return empty result for non-existent campaign', async () => {
			const result = await campaignService.getVouchers(999, testCampaign.prefix);

			expect(result.vouchers).toHaveLength(0);
			expect(result.pagination.total).toBe(0);
		});
	});

	describe('getAllVouchersForCampaign', () => {
		let testCampaign: any;

		beforeEach(async () => {
			testCampaign = await Campaign.create({
				name: 'Test Campaign',
				prefix: 'TEST',
				amount: 100,
				currency: 'SEK',
				validFrom: new Date('2024-01-01'),
				validTo: new Date('2024-12-31'),
			});

			// Generate test vouchers
			await campaignService.generateVouchers(testCampaign.id, 10);
		});

		it('should return all vouchers for campaign', async () => {
			const vouchers = await campaignService.getAllVouchersForCampaign(testCampaign.id, testCampaign.prefix);

			expect(vouchers).toHaveLength(10);
			vouchers.forEach(voucher => {
				expect(voucher.code).toMatch(new RegExp(`^${testCampaign.prefix}`));
				expect(voucher.isUsed).toBe(false);
			});
		});

		it('should return empty array for non-existent campaign', async () => {
			const vouchers = await campaignService.getAllVouchersForCampaign(999, testCampaign.prefix);

			expect(vouchers).toHaveLength(0);
		});
	});
});
