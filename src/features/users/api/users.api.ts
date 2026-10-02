import {apiClient} from '@/lib/api-client';
import type {User} from '../types';

export const getUsers = (signal?: AbortSignal) =>
    apiClient.get<User[]>('/users', {signal});