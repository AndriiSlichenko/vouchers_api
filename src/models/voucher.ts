import { type CreationOptional, DataTypes, type ForeignKey, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize';
import { sequelizeConnection } from '../db/config';
import Campaign from './campaign';

class Voucher extends Model<InferAttributes<Voucher>, InferCreationAttributes<Voucher>> {
	declare id?: CreationOptional<number>;
    declare campaignId: ForeignKey<Campaign['id']>;;
    declare code: string;
    declare isUsed?: boolean;
    declare usedAt?: Date;
    declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Voucher.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	code: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [6, 6],
		},
	},
    isUsed: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
        defaultValue: false,
	},
    usedAt: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	createdAt: {
		type: DataTypes.DATE,
		allowNull: true,
		defaultValue: DataTypes.NOW,
	},
	updatedAt: {
        type: DataTypes.DATE,
		allowNull: true,
		defaultValue: DataTypes.NOW
    },
}, {
	sequelize: sequelizeConnection,
	indexes: [
		{ fields: ['campaignId'] },
		{ fields: ['code'], unique: true },
		{ fields: ['isUsed'] },
	  ],
});

export default Voucher;
