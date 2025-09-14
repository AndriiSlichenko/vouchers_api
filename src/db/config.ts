import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelizeConnection = new Sequelize({
	dialect: 'mysql',
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '3306'),
	username: process.env.DB_USERNAME || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME || 'voucher_campaign',
	logging: false,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
});

export { sequelizeConnection };
