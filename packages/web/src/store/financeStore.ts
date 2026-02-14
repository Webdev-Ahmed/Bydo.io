import { create } from "zustand";
import { useCategoryStore } from "./categoryStore";
import { useTransactionStore } from "./transactionStore";
import { useBudgetStore } from "./budgetStore";
import { useReminderStore } from "./reminderStore";

interface FinanceState {
  isInitialized: boolean;
  isLoading: boolean;

  initializeFinanceData: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  isInitialized: false,
  isLoading: false,

  initializeFinanceData: async () => {
    set({ isLoading: true });
    try {
      await Promise.all([
        useCategoryStore.getState().fetchCategories(),
        useTransactionStore.getState().fetchTransactions(),
        useTransactionStore.getState().fetchSummary(),
        useTransactionStore.getState().fetchCategorySpending(),
        useTransactionStore.getState().fetchMonthlyStats(),
        useBudgetStore.getState().fetchBudgets(),
        useBudgetStore.getState().fetchBudgetProgress(),
        useReminderStore.getState().fetchUpcomingReminders(),
        useReminderStore.getState().fetchOverdueReminders(),
      ]);

      set({ isInitialized: true, isLoading: false });
    } catch (error) {
      console.error("Failed to initialize finance data:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  refreshAllData: async () => {
    try {
      await Promise.all([
        useCategoryStore.getState().fetchCategories(),
        useTransactionStore.getState().fetchTransactions(),
        useTransactionStore.getState().fetchSummary(),
        useTransactionStore.getState().fetchCategorySpending(),
        useBudgetStore.getState().fetchBudgets(),
        useBudgetStore.getState().fetchBudgetProgress(),
        useReminderStore.getState().fetchUpcomingReminders(),
        useReminderStore.getState().fetchOverdueReminders(),
      ]);
    } catch (error) {
      console.error("Failed to refresh finance data:", error);
      throw error;
    }
  },
}));
