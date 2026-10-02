import axios, {isAxiosError, isCancel} from 'axios';
import {env} from '@/config/env';
import type {ApiErrorBody} from '@/types/api';

export class ApiError extends Error {
    readonly status: number;
    readonly details: string[];

    constructor(status: number, messages: string[]) {
        super(messages[0] ?? 'Something went wrong');
        this.name = 'ApiError';
        this.status = status;
        this.details = messages;
    }
}

type QueryParams = Record<string, string | number | undefined>;

const http = axios.create({baseURL: env.apiUrl});

http.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (isCancel(error) || !isAxiosError<Partial<ApiErrorBody>>(error)) {
            return Promise.reject(error);
        }

        if (!error.response) {
            return Promise.reject(
                new ApiError(0, ['Cannot reach the server. Check your connection and try again.']),
            );
        }

        const {status, statusText, data} = error.response;
        const message = data?.message;
        const messages = Array.isArray(message)
            ? message
            : message
                ? [message]
                : [statusText || 'Request failed'];

        return Promise.reject(new ApiError(status, messages));
    },
);

export const apiClient = {
    get: <T>(path: string, options?: { params?: QueryParams; signal?: AbortSignal }) =>
        http.get<T>(path, options).then((response) => response.data),

    post: <T>(path: string, body: unknown, options?: { signal?: AbortSignal }) =>
        http.post<T>(path, body, options).then((response) => response.data),
};