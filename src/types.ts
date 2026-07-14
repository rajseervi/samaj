export interface PosterFormData {
  date: string;
  day: string;
  sponsorName: string;
  village: string;
  message: string;
  photoDataUrl: string | null;
}

export interface Poster extends PosterFormData {
  id: string;
  createdAt: string;
}

/* ─── Admin Panel Types ─── */

export interface Donator {
  id: string;
  name: string;
  village: string;
  phone: string;
  email: string;
  totalDonation: number;
  lastDonationDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: "bank" | "cash" | "digital";
  balance: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType = "credit" | "debit";
export type TransactionCategory =
  | "donation"
  | "expense"
  | "transfer"
  | "salary"
  | "maintenance"
  | "utility"
  | "other";

export interface LedgerEntry {
  id: string;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  accountId: string;
  donatorId?: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  username: string;
  name: string;
}

export interface DashboardStats {
  totalDonators: number;
  totalDonations: number;
  totalExpenses: number;
  balance: number;
  recentTransactions: LedgerEntry[];
  activeAccounts: number;
}
