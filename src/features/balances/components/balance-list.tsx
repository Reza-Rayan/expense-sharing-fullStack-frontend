import {CircleCheck} from 'lucide-react';
import {EmptyState} from '@/components/ui/empty-state';
import {ErrorState} from '@/components/ui/error-state';
import {Skeleton} from '@/components/ui/skeleton';
import {useBalances} from '../hooks/use-balances';
import {BalanceItem} from './balance-item';

function BalanceListSkeleton() {
    return (
        <div className="space-y-3" role="status" aria-label="در حال بارگذاری تراز حساب‌ها">
            {Array.from({length: 3}, (_, index) => (
                <Skeleton key={index} className="h-16"/>
            ))}
        </div>
    );
}

export function BalanceList() {
    const {data, error, isPending, isFetching, refetch} = useBalances();

    if (isPending) return <BalanceListSkeleton/>;

    if (error) {
        return (
            <ErrorState
                message={error.message}
                onRetry={() => void refetch()}
                isRetrying={isFetching}
            />
        );
    }

    if (data.length === 0) {
        return (
            <EmptyState
                icon={CircleCheck}
                title="همه‌چیز تسویه است"
                description="فعلاً هیچ‌کس به دیگری بدهکار نیست."
            />
        );
    }

    return (
        <ul className="space-y-3">
            {data.map((balance, index) => (
                <BalanceItem
                    key={`${balance.debtor.id}-${balance.creditor.id}`}
                    balance={balance}
                    index={index}
                />
            ))}
        </ul>
    );
}