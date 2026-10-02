import {Avatar} from '@/components/ui/avatar';
import {formatCurrency, formatDate} from '@/lib/format';
import type {Expense} from '../types';

interface ExpenseItemProps {
    expense: Expense;
    index?: number;
}

export function ExpenseItem({expense, index = 0}: ExpenseItemProps) {
    const {description, amount, createdAt, paidBy, paidFor} = expense;

    return (
        <li
            className="fade-up glass-soft flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors hover:bg-white/10"
            style={{animationDelay: `${Math.min(index, 8) * 60}ms`}}
        >
            <Avatar name={paidBy.name}/>

            <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-white" title={description}>
                    {description}
                </p>
                <p className="mt-0.5 text-sm leading-6 text-slate-400">
                    <bdi className="text-slate-200">{paidBy.name}</bdi>
                    {' برای '}
                    <bdi className="text-slate-200">{paidFor.name}</bdi>
                    {' پرداخت کرد'}
                </p>
            </div>

            <div className="shrink-0 text-end">
                <p className="font-bold text-cyan-200">{formatCurrency(amount)}</p>
                <time dateTime={createdAt} className="text-xs text-slate-500">
                    {formatDate(createdAt)}
                </time>
            </div>
        </li>
    );
}