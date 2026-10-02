const numberFormatter = new Intl.NumberFormat('fa-IR', {
    maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'medium',
});

export const formatCurrency = (amount: number): string =>
    `${numberFormatter.format(amount)} دلار`;

export const formatDate = (isoDate: string): string =>
    dateFormatter.format(new Date(isoDate));

export const formatNumber = (value: number): string =>
    numberFormatter.format(value);
