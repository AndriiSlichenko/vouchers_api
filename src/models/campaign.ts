import { type Association, type CreationOptional, DataTypes, type ForeignKey, type InferAttributes, type InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import { sequelizeConnection } from '../db/config';
import Voucher from './voucher';

class Campaign extends Model<InferAttributes<Campaign>, InferCreationAttributes<Campaign>> {
	declare static associations: {
		vouchers: Association<Campaign, Voucher>;
	};

	declare id: CreationOptional<number>;
    declare name: string;
    declare prefix: string;
    declare amount: number;
    declare currency: string;
    declare validFrom: Date;
    declare validTo: Date;
	declare vauchers?: NonAttribute<Voucher[]>;
    declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Campaign.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	prefix: {
		type: DataTypes.STRING,
		allowNull: true,
	},
    amount: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
    currency: {
		type: DataTypes.STRING,
		allowNull: true,
	},
    validFrom: {
        type: DataTypes.DATE,
		allowNull: true,
    },
    validTo: {
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
});

Campaign.hasMany(Voucher, {
	sourceKey: 'id',
	foreignKey: 'campaignId',
	as: 'vauchers',
});

export default Campaign;
