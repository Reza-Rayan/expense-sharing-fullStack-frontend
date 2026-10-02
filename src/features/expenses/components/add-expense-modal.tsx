import {Dialog, DialogContent} from '@/components/ui/dialog';
import {useUiStore} from '@/stores/ui.store';
import {AddExpenseForm} from './add-expense-form';

export function AddExpenseModal() {
    const closeAddExpense = useUiStore((state) => state.closeAddExpense);

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) closeAddExpense();
            }}
        >
            <DialogContent
                title="ثبت هزینه‌ی جدید"
                description="مشخص کن چه کسی پرداخت کرده و هزینه برای چه کسی بوده است."
            >
                <AddExpenseForm onClose={closeAddExpense}/>
            </DialogContent>
        </Dialog>
    );
}