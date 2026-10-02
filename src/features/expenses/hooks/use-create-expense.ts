import {useMutation, useQueryClient} from '@tanstack/react-query';
import {balancesKeys} from '@/features/balances';
import {createExpense} from '../api/expenses.api';
import {expensesKeys} from '../query-keys';

export function useCreateExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createExpense,
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: expensesKeys.all});
            void queryClient.invalidateQueries({queryKey: balancesKeys.all});
        },
    });
}