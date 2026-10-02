import {apiClient} from '@/lib/api-client';
import type {Paginated} from '@/types/api';
import type {CreateExpensePayload, Expense} from '../types';

export const EXPENSES_PAGE_SIZE = 10;

export const getExpenses = (page: number, signal?: AbortSignal) =>
    apiClient.get<Paginated<Expense>>('/expenses', {
        params: {page, limit: EXPENSES_PAGE_SIZE},
        signal,
    });

export const createExpense = (payload: CreateExpensePayload) =>
    apiClient.post<Expense>('/expenses', payload);