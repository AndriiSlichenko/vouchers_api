import Campaign from '../models/campaign';
import { sequelizeConnection } from './config';

const INITIAL_CAMPAIGNS = [
	{
		name: 'Campaign 1',
		prefix: 'DISCOUNT',
		amount: 100,
		currency: 'EUR',
		validFrom: new Date('2025-01-01'), 
		validTo: new Date('2026-01-01'),
	},
];

export const seedDb = async () => {
	await sequelizeConnection.sync({ force: true });
	await Campaign.bulkCreate(INITIAL_CAMPAIGNS);
};

export const initDb = async () => {
	await seedDb();
};

