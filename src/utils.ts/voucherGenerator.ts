const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const generateRandomString = (length: number): string => {
	let result = '';

	for (let i = 0; i < length; i++) {
		result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
	}

	return result;
};

const generateVoucherCode = (): string => {
	return generateRandomString(6);
};

export const generateVoucherCodes = (count: number): string[] => {
	const codes = new Set<string>();

    while (codes.size < count) {
        codes.add(generateVoucherCode());
    }

	return Array.from(codes);
};

export const prepareVoucherCodes = (campaignId: number, count: number): { campaignId: number, code: string }[] => {
	const codes = generateVoucherCodes(count);
	return codes.map((code) => ({ campaignId, code }));
};
