import { create } from "zustand";
import api from "../lib/axios";
import axios, { AxiosError } from "axios";
import type {
  Budget,
  CreateBudgetInput,
  UpdateBudgetInput,
  BudgetProgress,
} from "@todo/shared";

interface BudgetState {
  budgets: Budget[];
  budgetProgress: BudgetProgress[];
  isLoading: boolean;
  error: string | null;

  fetchBudgets: (month?: number, year?: number) => Promise<void>;
  fetchBudgetProgress: (month?: number, year?: number) => Promise<void>;
  createBudget: (data: CreateBudgetInput) => Promise<void>;
  updateBudget: (id: string, data: UpdateBudgetInput) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  getBudgetByCategory: (
    categoryId: string,
    month: number,
    year: number,
  ) => Budget | undefined;
  getBudgetsForMonth: (month: number, year: number) => Budget[];
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  budgetProgress: [],
  isLoading: false,
  error: null,

  fetchBudgets: async (month?: number, year?: number) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (month) params.append("month", month.toString());
      if (year) params.append("year", year.toString());

      const response = await api.get(`/budgets?${params.toString()}`);
      set({ budgets: response.data.budgets, isLoading: false });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<{ message: string }>;
        set({
          error: error.response?.data?.message || "Failed to fetch budgets",
          isLoading: false,
        });
      } else {
        set({ error: "An unexpected error occurred", isLoading: false });
      }
      throw err;
    }
  },

  fetchBudgetProgress: async (month?: number, year?: number) => {
    const params = new URLSearchParams();
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());

    const response = await api.get(`/budgets/progress?${params.toString()}`);
    set({ budgetProgress: response.data.budgetProgress });
  },

  createBudget: async (data: CreateBudgetInput) => {
    const response = await api.post("/budgets", data);
    set({ budgets: [...get().budgets, response.data.budget] });
    await get().fetchBudgetProgress();
  },

  updateBudget: async (id: string, data: UpdateBudgetInput) => {
    const response = await api.put(`/budgets/${id}`, data);
    set({
      budgets: get().budgets.map((budget) =>
        budget.id === id ? response.data.budget : budget,
      ),
    });
    await get().fetchBudgetProgress();
  },

  deleteBudget: async (id: string) => {
    await api.delete(`/budgets/${id}`);
    set({ budgets: get().budgets.filter((budget) => budget.id !== id) });
    await get().fetchBudgetProgress();
  },

  getBudgetByCategory: (categoryId: string, month: number, year: number) => {
    return get().budgets.find(
      (budget) =>
        budget.categoryId === categoryId &&
        budget.month === month &&
        budget.year === year,
    );
  },

  getBudgetsForMonth: (month: number, year: number) => {
    return get().budgets.filter(
      (budget) => budget.month === month && budget.year === year,
    );
  },
}));
