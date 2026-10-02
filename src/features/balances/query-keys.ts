export const balancesKeys = {
    all: ['balances'] as const,
    list: () => [...balancesKeys.all, 'list'] as const,
};