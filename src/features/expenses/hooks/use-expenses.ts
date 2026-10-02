import {type InfiniteData, useInfiniteQuery} from '@tanstack/react-query';
import type {Paginated} from '@/types/api';
import {getExpenses} from '../api/expenses.api';
import {expensesKeys} from '../query-keys';
import type {Expense} from '../types';

const selectExpenses = (data: InfiniteData<Paginated<Expense>>) => ({
    items: [
        ...new Map(
            data.pages.flatMap((page) => page.items).map((expense) => [expense.id, expense]),
        ).values(),
    ],
    total: data.pages[0]?.meta.total ?? 0,
});

export function useExpenses() {
    return useInfiniteQuery({
        queryKey: expensesKeys.list(),
        queryFn: ({pageParam, signal}) => getExpenses(pageParam, signal),
        initialPageParam: 1,
        getNextPageParam: ({meta}) =>
            meta.page < meta.totalPages ? meta.page + 1 : undefined,
        select: selectExpenses,
    });
}