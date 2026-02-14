import { create } from "zustand";
import api from "../lib/axios";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@todo/shared";
import axios, { AxiosError } from "axios";

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  createCategory: (data: CreateCategoryInput) => Promise<void>;
  updateCategory: (id: string, data: UpdateCategoryInput) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoriesByType: (type: "INCOME" | "EXPENSE") => Category[];
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get("/categories");
      set({ categories: response.data.categories, isLoading: false });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<{ message: string }>;
        set({
          error: error.response?.data?.message || "Failed to fetch categories",
          isLoading: false,
        });
      } else {
        set({ error: "An unexpected error occurred", isLoading: false });
      }
      throw err;
    }
  },

  createCategory: async (data: CreateCategoryInput) => {
    const response = await api.post("/categories", data);
    set({ categories: [...get().categories, response.data.category] });
  },

  updateCategory: async (id: string, data: UpdateCategoryInput) => {
    const response = await api.put(`/categories/${id}`, data);
    set({
      categories: get().categories.map((cat) =>
        cat.id === id ? response.data.category : cat,
      ),
    });
  },

  deleteCategory: async (id: string) => {
    await api.delete(`/categories/${id}`);
    set({ categories: get().categories.filter((cat) => cat.id !== id) });
  },

  getCategoriesByType: (type: "INCOME" | "EXPENSE") => {
    return get().categories.filter((cat) => cat.type === type);
  },
}));
