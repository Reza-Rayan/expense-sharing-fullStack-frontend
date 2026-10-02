import {create} from 'zustand';

export type HomeTab = 'expenses' | 'balances';

interface UiState {
    activeTab: HomeTab;
    setActiveTab: (tab: HomeTab) => void;

    isAddExpenseOpen: boolean;
    openAddExpense: () => void;
    closeAddExpense: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
    activeTab: 'expenses',
    setActiveTab: (activeTab) => set({activeTab}),

    isAddExpenseOpen: false,
    openAddExpense: () => set({isAddExpenseOpen: true}),
    closeAddExpense: () => set({isAddExpenseOpen: false}),
}));