import type {User} from '@/features/users';

export interface Expense {
    id: number;
    amount: number;
    description: string;
    createdAt: string;
    paidById: number;
    paidForId: number;
    paidBy: User; // پول رو داده
    paidFor: User; // بدهکار می‌شه
}


export interface CreateExpensePayload {
    paidById: number;
    paidForId: number;
    amount: number; // $$
    description: string;
}