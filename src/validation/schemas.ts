import Joi from 'joi';

export const createCampaignSchema = Joi.object({
	name: Joi.string().min(1).max(255).required().messages({
		'string.empty': 'Campaign name is required',
		'string.min': 'Campaign name must be at least 1 character long',
		'string.max': 'Campaign name must not exceed 255 characters',
	}),
	prefix: Joi.string().min(1).max(50).uppercase().required().messages({
		'string.empty': 'Prefix is required',
		'string.min': 'Prefix must be at least 1 character long',
		'string.max': 'Prefix must not exceed 50 characters',
	}),
	amount: Joi.number().positive().precision(2).required().messages({
		'number.positive': 'Amount must be a positive number',
		'number.base': 'Amount must be a valid number',
	}),
	currency: Joi.string().length(3).uppercase().required().messages({
		'string.length': 'Currency must be exactly 3 characters',
		'string.uppercase': 'Currency must be uppercase',
	}),
	validFrom: Joi.date().iso().required().messages({
		'date.format': 'Valid from date must be in ISO format',
		'any.required': 'Valid from date is required',
	}),
	validTo: Joi.date().iso().greater(Joi.ref('validFrom')).required().messages({
		'date.format': 'Valid to date must be in ISO format',
		'date.greater': 'Valid to date must be after valid from date',
		'any.required': 'Valid to date is required',
	}),
});

export const generateVouchersSchema = Joi.object({
	count: Joi.number().integer().min(1).max(100000).required().messages({
		'number.integer': 'Count must be an integer',
		'number.min': 'Count must be at least 1',
		'number.max': 'Count cannot exceed 100,000',
	}),
});

export const campaignIdSchema = Joi.object({
	id: Joi.number().integer().positive().required().messages({
		'number.integer': 'Campaign ID must be an integer',
		'number.positive': 'Campaign ID must be positive',
	}),
});

export const listVouchersSchema = Joi.object({
	page: Joi.number().integer().min(1).default(1),
	limit: Joi.number().integer().min(1).max(1000).default(50),
	isUsed: Joi.boolean().optional(),
});

export const listCampaignsSchema = Joi.object({
	page: Joi.number().integer().min(1).default(1),
	limit: Joi.number().integer().min(1).max(100).default(20),
});
