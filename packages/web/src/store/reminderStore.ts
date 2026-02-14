import { create } from "zustand";
import api from "../lib/axios";
import axios, { AxiosError } from "axios";
import type {
  FinancialReminder,
  CreateReminderInput,
  UpdateReminderInput,
  CompleteReminderInput,
} from "@todo/shared";

interface ReminderState {
  reminders: FinancialReminder[];
  upcomingReminders: FinancialReminder[];
  overdueReminders: FinancialReminder[];
  isLoading: boolean;
  error: string | null;

  fetchReminders: (completed?: boolean, type?: string) => Promise<void>;
  fetchUpcomingReminders: (days?: number) => Promise<void>;
  fetchOverdueReminders: () => Promise<void>;
  createReminder: (data: CreateReminderInput) => Promise<void>;
  updateReminder: (id: string, data: UpdateReminderInput) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  completeReminder: (id: string, data: CompleteReminderInput) => Promise<void>;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: [],
  upcomingReminders: [],
  overdueReminders: [],
  isLoading: false,
  error: null,

  fetchReminders: async (completed?: boolean, type?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (completed !== undefined)
        params.append("completed", completed.toString());
      if (type) params.append("type", type);

      const response = await api.get(`/reminders?${params.toString()}`);
      set({ reminders: response.data.reminders, isLoading: false });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<{ message: string }>;
        set({
          error: error.response?.data?.message || "Failed to fetch reminders",
          isLoading: false,
        });
      } else {
        set({ error: "An unexpected error occurred", isLoading: false });
      }
      throw err;
    }
  },

  fetchUpcomingReminders: async (days = 7) => {
    const params = new URLSearchParams();
    params.append("days", days.toString());

    const response = await api.get(`/reminders/upcoming?${params.toString()}`);
    set({ upcomingReminders: response.data.reminders });
  },

  fetchOverdueReminders: async () => {
    const response = await api.get("/reminders/overdue");
    set({ overdueReminders: response.data.reminders });
  },

  createReminder: async (data: CreateReminderInput) => {
    const response = await api.post("/reminders", data);
    set({ reminders: [response.data.reminder, ...get().reminders] });
    await get().fetchUpcomingReminders();
  },

  updateReminder: async (id: string, data: UpdateReminderInput) => {
    const response = await api.put(`/reminders/${id}`, data);
    set({
      reminders: get().reminders.map((reminder) =>
        reminder.id === id ? response.data.reminder : reminder,
      ),
    });
  },

  deleteReminder: async (id: string) => {
    await api.delete(`/reminders/${id}`);
    set({
      reminders: get().reminders.filter((reminder) => reminder.id !== id),
      upcomingReminders: get().upcomingReminders.filter(
        (reminder) => reminder.id !== id,
      ),
      overdueReminders: get().overdueReminders.filter(
        (reminder) => reminder.id !== id,
      ),
    });
  },

  completeReminder: async (id: string, data: CompleteReminderInput) => {
    const response = await api.put(`/reminders/${id}/complete`, data);
    set({
      reminders: get().reminders.map((reminder) =>
        reminder.id === id ? response.data.reminder : reminder,
      ),
    });
    await get().fetchUpcomingReminders();
    await get().fetchOverdueReminders();
  },
}));
