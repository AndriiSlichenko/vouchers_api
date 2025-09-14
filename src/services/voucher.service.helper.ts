import { QueryTypes, Transaction } from "sequelize";
import { sequelizeConnection } from "../db/config";
import Voucher from "../models/voucher";

const insertVouchers = async (t: Transaction, campaignId: number, vouchers: string[]) => {
	const query = `
		INSERT IGNORE INTO Vouchers (campaignId, code, createdAt, updatedAt) VALUES ?
	`;
	const date = new Date();
	const options = {
		replacements: [vouchers.map((code) => [campaignId, code, date, date])],
		type: QueryTypes.INSERT,
		transaction: t,
	};

	const result = await sequelizeConnection.query(query, options);
	const insertedItems = result[1] as number;
	
	return insertedItems;
}

export const insertBatchVouchers = async (campaignId: number, vouchers: string[]) => {
	const BATCH_SIZE = 5000;
	let inserted = 0;

	await sequelizeConnection.transaction(async (t) => {
		for (let i = 0; i < vouchers.length; i += BATCH_SIZE) {
			try {
				const batch = vouchers.slice(i, i + BATCH_SIZE);
				const insertedItems = await insertVouchers(t, campaignId, batch);
				inserted += insertedItems;
			} catch (error) {
				console.error('error: ', error);
			}
			console.log(`Inserted batch ${i / BATCH_SIZE + 1}`);
		}
	});

	return inserted;
};

export const addVoucherPrefix = (vouchers: Voucher[], prefix: string) =>
	vouchers.map(voucher => {
		voucher.code = `${prefix}-${voucher.code}`;
		return voucher;
	});
