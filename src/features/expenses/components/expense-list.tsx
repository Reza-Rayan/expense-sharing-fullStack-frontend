import {ChevronDown, LoaderCircle, Receipt} from 'lucide-react';
import {EmptyState} from '@/components/ui/empty-state';
import {ErrorState} from '@/components/ui/error-state';
import {Skeleton} from '@/components/ui/skeleton';
import {formatNumber} from '@/lib/format';
import {EXPENSES_PAGE_SIZE} from '../api/expenses.api';
import {useExpenses} from '../hooks/use-expenses';
import {ExpenseItem} from './expense-item';

function ExpenseListSkeleton() {
    return (
        <div className="space-y-3" role="status" aria-label="در حال بارگذاری هزینه‌ها">
            {Array.from({length: 4}, (_, index) => (
                <Skeleton key={index} className="h-[4.5rem]"/>
            ))}
        </div>
    );
}

export function ExpenseList() {
    const {
        data,
        error,
        isPending,
        isFetching,
        refetch,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
    } = useExpenses();

    if (isPending) return <ExpenseListSkeleton/>;

    if (!data) {
        return (
            <ErrorState
                message={error?.message ?? 'خطایی رخ داد'}
                onRetry={() => void refetch()}
                isRetrying={isFetching}
            />
        );
    }

    if (data.items.length === 0) {
        return (
            <EmptyState
                icon={Receipt}
                title="هنوز هزینه‌ای ثبت نشده"
                description="با دکمه‌ی «ثبت هزینه» اولین هزینه را اضافه کن."
            />
        );
    }

    const remaining = data.total - data.items.length;

    return (
        <div className="space-y-4">
            <ul className="space-y-3">
                {data.items.map((expense, index) => (
                    <ExpenseItem
                        key={expense.id}
                        expense={expense}
                        index={index % EXPENSES_PAGE_SIZE}
                    />
                ))}
            </ul>

            {hasNextPage && (
                <div className="flex flex-col items-center gap-2">
                    {isFetchNextPageError && (
                        <p role="alert" className="text-sm text-rose-300">
                            بارگذاری ناموفق بود. دوباره تلاش کن.
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={() => void fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm
                         font-medium text-white ring-1 ring-white/20 transition hover:bg-white/20 focus-visible:outline-2
                          focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300 disabled:opacity-60"
                    >
                        {isFetchingNextPage ? (
                            <LoaderCircle className="size-4 animate-spin" aria-hidden="true"/>
                        ) : (
                            <ChevronDown className="size-4" aria-hidden="true"/>
                        )}
                        نمایش {formatNumber(remaining)} مورد دیگر
                    </button>
                </div>
            )}
        </div>
    );
}