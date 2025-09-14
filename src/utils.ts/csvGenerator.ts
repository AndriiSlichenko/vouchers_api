import { VoucherCsvRow, VoucherForCSV } from '../types';

const vouchersToCsvData = (vouchers: VoucherForCSV[]): VoucherCsvRow[] => (
    vouchers.map(({ id, code, isUsed, usedAt, createdAt }) => ({
        id,
        code,
        isUsed: isUsed ? 'Yes' : 'No',
        usedAt: usedAt ? usedAt.toISOString().split('T')[0] : '',
        createdAt: createdAt.toISOString().split('T')[0],
    }))
);

const formatDate = (isoString: string) => {
    try {
        const date = new Date(isoString);
        return date.toISOString().split("T")[0];
    } catch (error) {
        return isoString;
    }
};

export const generateVoucherCsvInMemory = (vouchers: VoucherForCSV[]): string => {
    const csvData = vouchersToCsvData(vouchers);

    const header = 'ID,Voucher Code,Used,Used At,Created At\n';
    const rows = csvData.map(({ id, code, isUsed, usedAt, createdAt }) => {
        return `${id},"${code}",${isUsed},"${usedAt}","${formatDate(createdAt)}"`;
    }).join('\n');

    return header + rows;
};
