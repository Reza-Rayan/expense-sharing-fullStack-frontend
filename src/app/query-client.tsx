import {QueryClient} from '@tanstack/react-query';
import {ApiError} from '@/lib/api-client';

const isClientError = (error: unknown): boolean =>
    error instanceof ApiError && error.status >= 400 && error.status < 500;

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: (failureCount, error) => !isClientError(error) && failureCount < 1,
        },
    },
});