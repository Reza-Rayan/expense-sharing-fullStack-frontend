export const expensesKeys = {
    all: ['expenses'] as const,
    list: () => [...expensesKeys.all, 'list'] as const,
};