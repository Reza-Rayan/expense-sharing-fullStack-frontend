import {lazy} from 'react';

export {ExpenseList} from './components/expense-list';
export {expensesKeys} from './query-keys';

const loadAddExpenseModal = () => import('./components/add-expense-modal');

export const AddExpenseModal = lazy(() =>
    loadAddExpenseModal().then((module) => ({default: module.AddExpenseModal})),
);

export const preloadAddExpenseModal = (): void => {
    void loadAddExpenseModal();
};