import { create } from "zustand";
import api from "../lib/axios";
import axios, { AxiosError } from "axios";
import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  FinanceSummary,
  CategorySpending,
  MonthlyStats,
} from "@todo/shared";

interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: "INCOME" | "EXPENSE";
  categoryId?: string;
}

interface TransactionState {
  transactions: Transaction[];
  summary: FinanceSummary | null;
  categorySpending: CategorySpending[];
  monthlyStats: MonthlyStats[];
  isLoading: boolean;
  error: string | null;
  filters: TransactionFilters;

  fetchTransactions: (filters?: TransactionFilters) => Promise<void>;
  fetchSummary: (startDate?: string, endDate?: string) => Promise<void>;
  fetchCategorySpending: (
    startDate?: string,
    endDate?: string,
    type?: "INCOME" | "EXPENSE",
  ) => Promise<void>;
  fetchMonthlyStats: (year?: number, months?: number) => Promise<void>;
  createTransaction: (data: CreateTransactionInput) => Promise<void>;
  updateTransaction: (
    id: string,
    data: UpdateTransactionInput,
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setFilters: (filters: TransactionFilters) => void;
  clearFilters: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  summary: null,
  categorySpending: [],
  monthlyStats: [],
  isLoading: false,
  error: null,
  filters: {},

  fetchTransactions: async (filters?: TransactionFilters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      const filtersToUse = filters || get().filters;

      if (filtersToUse.startDate)
        params.append("startDate", filtersToUse.startDate);
      if (filtersToUse.endDate) params.append("endDate", filtersToUse.endDate);
      if (filtersToUse.type) params.append("type", filtersToUse.type);
      if (filtersToUse.categoryId)
        params.append("categoryId", filtersToUse.categoryId);

      const response = await api.get(`/transactions?${params.toString()}`);
      set({
        transactions: response.data.transactions,
        isLoading: false,
        filters: filtersToUse,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<{ message: string }>;
        set({
          error:
            error.response?.data?.message || "Failed to fetch transactions",
          isLoading: false,
        });
      } else {
        set({ error: "An unexpected error occurred", isLoading: false });
      }
      throw err;
    }
  },

  fetchSummary: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await api.get(
      `/transactions/summary?${params.toString()}`,
    );
    set({ summary: response.data });
  },

  fetchCategorySpending: async (
    startDate?: string,
    endDate?: string,
    type?: "INCOME" | "EXPENSE",
  ) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (type) params.append("type", type);

    const response = await api.get(
      `/transactions/category-spending?${params.toString()}`,
    );
    set({ categorySpending: response.data.categorySpending });
  },

  fetchMonthlyStats: async (year?: number, months = 12) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    params.append("months", months.toString());

    const response = await api.get(
      `/transactions/monthly-stats?${params.toString()}`,
    );
    set({ monthlyStats: response.data.monthlyStats });
  },

  createTransaction: async (data: CreateTransactionInput) => {
    const response = await api.post("/transactions", data);
    set({ transactions: [response.data.transaction, ...get().transactions] });

    await get().fetchSummary();
    await get().fetchCategorySpending();
  },

  updateTransaction: async (id: string, data: UpdateTransactionInput) => {
    const response = await api.put(`/transactions/${id}`, data);
    set({
      transactions: get().transactions.map((txn) =>
        txn.id === id ? response.data.transaction : txn,
      ),
    });

    await get().fetchSummary();
    await get().fetchCategorySpending();
  },

  deleteTransaction: async (id: string) => {
    await api.delete(`/transactions/${id}`);
    set({ transactions: get().transactions.filter((txn) => txn.id !== id) });

    await get().fetchSummary();
    await get().fetchCategorySpending();
  },

  setFilters: (filters: TransactionFilters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },
}));
