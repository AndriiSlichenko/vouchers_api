import { Request } from "express";

export interface ModifiedRequest extends Request {
    validatedQuery?: Record<string, any>;
};

export interface VoucherCsvRow {
    id: number;
    code: string;
    isUsed: string;
    usedAt: string;
    createdAt: string;
};

export interface VoucherCSV {
    id: number;
    code: string;
    isUsed: boolean | null;
    usedAt: Date;
    createdAt: Date;
};

export interface Campaign {
    id: number;
    name: string;
    prefix: string;
    amount: number;
    currency: string;
    validFrom: string;
    validTo: string;
    createdAt: string;
    updatedAt: string;
};
  
export interface Voucher {
    id: number;
    campaignId: number;
    code: string;
    isUsed: boolean;
    usedAt: Date;
    createdAt: Date;
    updatedAt: Date;
};
export interface CampaignData {
	name: string;
	prefix: string;
	amount: number;
	currency: string;
	validFrom: Date;
	validTo: Date;
};
