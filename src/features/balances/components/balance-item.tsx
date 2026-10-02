import { Avatar } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/format';
import type { Balance } from '../types';

interface BalanceItemProps {
    balance: Balance;
    index?: number;
}

export function BalanceItem({ balance, index = 0 }: BalanceItemProps) {
    const { debtor, creditor, amount } = balance;

    return (
        <li
            className="fade-up glass-soft flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors hover:bg-white/10"
            style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
        >
            <div className="flex shrink-0 items-center">
                <Avatar name={debtor.name} />
                <Avatar name={creditor.name} className="-ms-3 ring-2 ring-[#0b0720]" />
            </div>

            <p className="min-w-0 flex-1 leading-8 text-slate-300">
                <bdi className="font-bold text-white">{debtor.name}</bdi>
                {' به '}
                <bdi className="font-bold text-white">{creditor.name}</bdi>{' '}
                <span className="whitespace-nowrap rounded-full bg-amber-400/15 px-2.5 py-0.5 font-bold text-amber-200 ring-1 ring-amber-300/30">
          {formatCurrency(amount)}
        </span>
                {' بدهکار است'}
            </p>
        </li>
    );
}