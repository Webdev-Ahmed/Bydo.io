export interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  color: string | null;
  icon: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: "INCOME" | "EXPENSE";
  categoryId: string | null;
  category?: Category;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  amount: number;
  month: number;
  year: number;
  categoryId: string;
  category?: Category;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialReminder {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  reminderType:
    | "BILL_PAYMENT"
    | "BUDGET_REVIEW"
    | "SAVINGS_GOAL"
    | "TAX_DEADLINE"
    | "SUBSCRIPTION_RENEWAL"
    | "GENERAL";
  amount: number | null;
  categoryId: string | null;
  category?: Category;
  isRecurring: boolean;
  recurrence: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY" | null;
  transactionId: string | null;
  transaction?: Transaction;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard/Stats types
export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
  color: string | null;
  transactionCount: number;
}

export interface MonthlyStats {
  month: number;
  year: number;
  income: number;
  expenses: number;
  balance: number;
}

export interface BudgetProgress {
  budgetId: string;
  categoryId: string;
  categoryName: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentage: number;
  month: number;
  year: number;
  color: string | null;
}
