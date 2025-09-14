import Campaign from '../models/campaign';
import Voucher from '../models/voucher';
import { generateVoucherCodes, prepareVoucherCodes } from '../utils.ts/voucherGenerator';
import { CampaignData, VoucherCSV } from '../types';
import { addVoucherPrefix, insertBatchVouchers } from './voucher.service.helper';

const MAX_RETRIES = 3;
export class CampaignService {
	async createCampaign(campaignData: CampaignData) {
		return Campaign.create(campaignData);
	}

	async getCampaigns(page: number = 1, limit: number = 20) {
		const offset = (page - 1) * limit;
		const { count, rows } = await Campaign.findAndCountAll({ limit, offset });

		return {
			campaigns: rows,
			pagination: {
				page,
				limit,
				total: count,
				pages: Math.ceil(count / limit),
			},
		};
	}

	async getCampaignById(id: number) {
		return Campaign.findOne({ where: { id } });
	}

	async deleteCampaign(id: number) {
		return Campaign.destroy({ where: { id } });
	}

	async fastSolution(campaignId: number, count: number) {
		let remaining = count;
		let totalInserted = 0;
		let currentRetry = 0;

		while (remaining > 0 && currentRetry <= MAX_RETRIES) {
			const voucherData = generateVoucherCodes(remaining);
			const inserted = await insertBatchVouchers(campaignId, voucherData);
			remaining -= inserted;
			totalInserted += inserted;
			currentRetry++;
		}

		return totalInserted;
	}

	async cleanSolution(campaignId: number, count: number) {
		let remaining = count;
		let totalInserted = 0;
		let currentRetry = 0;

		while (remaining > 0 && currentRetry <= MAX_RETRIES) {
			const voucherData = prepareVoucherCodes(campaignId, remaining);
			const result = await Voucher.bulkCreate(voucherData, {
			  	ignoreDuplicates: true,
				validate: false,
  				hooks: false,
			});
			const inserted = result.length;
			remaining -= inserted;
			totalInserted += inserted;
			currentRetry++;
		}

		return totalInserted;
	}

	async generateVouchers(campaignId: number, count: number) {
		// I provided two solutions, first one is query-like (fast), second one is bulkCreate (slow)

		// takes around 2 seconds
		const insertedCount = await this.fastSolution(campaignId, count);

		// takes around 2.5 seconds
		// const insertedCount = await this.cleanSolution(campaignId, count);
		return insertedCount;
	}

	async getVouchers(campaignId: number, prefix: string, page: number = 1, limit: number = 50) {
		const offset = (page - 1) * limit;
		const { count, rows } = await Voucher.findAndCountAll({
			limit,
			offset,
			where: { campaignId },
		});

		const vouchersWithPrefix = addVoucherPrefix(rows, prefix);

		return {
			vouchers: vouchersWithPrefix,
			pagination: {
				page,
				limit,
				total: count,
				pages: Math.ceil(count / limit),
			},
		};
	}

	async getAllVouchersForCampaign(campaignId: number, prefix: string): Promise<VoucherCSV[]> {
		const vouchers = await Voucher.findAll({
			attributes: ['id', 'code', 'isUsed', 'usedAt', 'createdAt'],
			where: { campaignId },
			limit: 500_000,
		});

		const vouchersWithPrefix = addVoucherPrefix(vouchers, prefix);

		return vouchersWithPrefix as VoucherCSV[];
	}
};
