export const usersKeys = {
    all: ['users'] as const,
    list: () => [...usersKeys.all, 'list'] as const,
};