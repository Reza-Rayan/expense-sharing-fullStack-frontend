import {Plus, Receipt, Scale} from 'lucide-react';
import {Suspense} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {BalanceList} from '@/features/balances';
import {AddExpenseModal, ExpenseList, preloadAddExpenseModal,} from '@/features/expenses';
import {type HomeTab, useUiStore} from '@/stores/ui.store';

const isHomeTab = (value: string): value is HomeTab =>
    value === 'expenses' || value === 'balances';

export function HomePage() {
    const activeTab = useUiStore((state) => state.activeTab);
    const setActiveTab = useUiStore((state) => state.setActiveTab);
    const isAddExpenseOpen = useUiStore((state) => state.isAddExpenseOpen);
    const openAddExpense = useUiStore((state) => state.openAddExpense);

    return (
        <main className="mx-auto max-w-2xl px-4 py-10">
            <header className="mb-8 text-center">
                <h1 className="text-gradient text-3xl font-black leading-relaxed sm:text-4xl">
                    هزینه‌های مشترک
                </h1>
                <p className="mt-2 text-slate-400">
                    هزینه‌ها را ثبت کن و ببین چه کسی به چه کسی بدهکار است
                </p>

                <button
                    type="button"
                    onClick={openAddExpense}
                    onPointerEnter={preloadAddExpenseModal}
                    onFocus={preloadAddExpenseModal}
                    className="btn-primary mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
                >
                    <Plus className="size-5" aria-hidden="true"/>
                    ثبت هزینه
                </button>
            </header>

            <Tabs
                value={activeTab}
                onValueChange={(value) => {
                    if (isHomeTab(value)) setActiveTab(value);
                }}
            >
                <TabsList aria-label="بخش‌های صفحه">
                    <TabsTrigger value="expenses">
                        <Receipt className="size-4" aria-hidden="true"/>
                        هزینه‌ها
                    </TabsTrigger>
                    <TabsTrigger value="balances">
                        <Scale className="size-4" aria-hidden="true"/>
                        تراز حساب‌ها
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="expenses" className="glass p-4 sm:p-6">
                    <ExpenseList/>
                </TabsContent>

                <TabsContent value="balances" className="glass p-4 sm:p-6">
                    <BalanceList/>
                </TabsContent>
            </Tabs>

            {isAddExpenseOpen && (
                <Suspense fallback={null}>
                    <AddExpenseModal/>
                </Suspense>
            )}
        </main>
    );
}