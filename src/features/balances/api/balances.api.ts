import {apiClient} from '@/lib/api-client';
import type {Balance} from '../types';

export const getBalances = (signal?: AbortSignal) =>
    apiClient.get<Balance[]>('/balances', {signal});