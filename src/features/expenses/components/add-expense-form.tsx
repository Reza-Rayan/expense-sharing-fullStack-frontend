import {zodResolver} from '@hookform/resolvers/zod';
import {LoaderCircle} from 'lucide-react';
import {useForm} from 'react-hook-form';
import toast from 'react-hot-toast';
import {ErrorState} from '@/components/ui/error-state';
import {FormField} from '@/components/ui/form-field';
import {Skeleton} from '@/components/ui/skeleton';
import {useUsers} from '@/features/users';
import {useCreateExpense} from '../hooks/use-create-expense';
import {getCreateExpenseErrorMessage} from '../lib/error-message';
import {
    type CreateExpenseFormValues,
    createExpenseSchema,
    toCreateExpensePayload,
} from '../schemas/create-expense.schema';

interface AddExpenseFormProps {
    onClose: () => void;
}

export function AddExpenseForm({onClose}: AddExpenseFormProps) {
    const users = useUsers();
    const createExpense = useCreateExpense();

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<CreateExpenseFormValues>({
        resolver: zodResolver(createExpenseSchema),
        defaultValues: {paidById: '', paidForId: '', amount: '', description: ''},
    });

    const selectedPayer = watch('paidById');

    const onSubmit = handleSubmit((values) => {
        createExpense.mutate(toCreateExpensePayload(values), {
            onSuccess: () => {
                toast.success('هزینه با موفقیت ثبت شد');
                onClose();
            },
        });
    });

    if (users.isPending) {
        return (
            <div className="space-y-4" role="status" aria-label="در حال بارگذاری فرم">
                {Array.from({length: 4}, (_, index) => (
                    <Skeleton key={index} className="h-12"/>
                ))}
            </div>
        );
    }

    if (!users.data) {
        return (
            <ErrorState
                message={users.error?.message ?? 'خطایی رخ داد'}
                onRetry={() => void users.refetch()}
                isRetrying={users.isFetching}
            />
        );
    }

    return (
        <form onSubmit={onSubmit} noValidate>
            <fieldset disabled={createExpense.isPending} className="min-w-0 space-y-4">
                {createExpense.isError && (
                    <div
                        role="alert"
                        className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                    >
                        {getCreateExpenseErrorMessage(createExpense.error)}
                    </div>
                )}

                <FormField id="paidById" label="پرداخت‌کننده" error={errors.paidById?.message}>
                    <select
                        id="paidById"
                        className="field"
                        aria-invalid={errors.paidById ? true : undefined}
                        aria-describedby={errors.paidById ? 'paidById-error' : undefined}
                        {...register('paidById')}
                    >
                        <option value="">انتخاب کن</option>
                        {users.data.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField id="paidForId" label="هزینه برای" error={errors.paidForId?.message}>
                    <select
                        id="paidForId"
                        className="field"
                        aria-invalid={errors.paidForId ? true : undefined}
                        aria-describedby={errors.paidForId ? 'paidForId-error' : undefined}
                        {...register('paidForId')}
                    >
                        <option value="">انتخاب کن</option>
                        {users.data.map((user) => (
                            <option
                                key={user.id}
                                value={user.id}
                                disabled={String(user.id) === selectedPayer}
                            >
                                {user.name}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField id="amount" label="مبلغ" error={errors.amount?.message}>
                    <div className="relative">
                        <input
                            id="amount"
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            placeholder="مثلاً ۵۰"
                            className="field pe-16"
                            aria-invalid={errors.amount ? true : undefined}
                            aria-describedby={errors.amount ? 'amount-error' : undefined}
                            {...register('amount')}
                        />
                        <span
                            className="pointer-events-none absolute inset-y-0 inset-e-4 grid place-items-center
                             text-sm text-slate-400">
              دلار
            </span>
                    </div>
                </FormField>

                <FormField id="description" label="توضیحات" error={errors.description?.message}>
                    <input
                        id="description"
                        type="text"
                        autoComplete="off"
                        placeholder="مثلاً شام رستوران"
                        className="field"
                        aria-invalid={errors.description ? true : undefined}
                        aria-describedby={errors.description ? 'description-error' : undefined}
                        {...register('description')}
                    />
                </FormField>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        className="btn-primary inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5
                        py-3 font-bold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2
                         focus-visible:outline-fuchsia-300"
                    >
                        {createExpense.isPending && (
                            <LoaderCircle className="size-4 animate-spin" aria-hidden="true"/>
                        )}
                        {createExpense.isPending ? 'در حال ثبت…' : 'ثبت هزینه'}
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full bg-white/10 px-5 py-3 font-medium text-white ring-1 ring-white/20
                        transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2
                        focus-visible:outline-fuchsia-300"
                    >
                        انصراف
                    </button>
                </div>
            </fieldset>
        </form>
    );
}