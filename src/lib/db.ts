/* ─── Firestore database for admin panel ─── */

import { getDb } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc as firestoreUpdateDoc,
  deleteDoc,
  query,
  orderBy,
  FirestoreError,
} from "firebase/firestore";
import type { Donator, Account, LedgerEntry, Poster, DashboardStats } from "@/types";

const COLLECTIONS = {
  donators: "donators",
  accounts: "accounts",
  ledger: "ledger",
  posters: "posters",
} as const;

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/* ─── Permission error helper ─── */

export const FIRESTORE_RULES_GUIDE = `
## 🔐 Firestore Security Rules Need Update

**Error:** Missing or insufficient permissions — Firestore is in locked mode.

### Step-by-step fix (2 minutes):

1. **Go to:** https://console.firebase.google.com
2. Select project: **studio-164378229-17630**
3. Menu → **Firestore Database** → **Rules** tab
4. **Replace** the entire rules text with:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
\`\`\`

5. Click **Publish**

> ⚠️ These rules allow open read/write access. Use for development only. Lock down before production.
`;

export let lastPermissionError: string | null = null;

function isPermissionError(err: unknown): err is FirestoreError {
  return err instanceof FirestoreError && err.code === "permission-denied";
}

function handleDbError(err: unknown, operation: string): void {
  if (isPermissionError(err)) {
    console.warn(`⚠️ Firestore permission denied during "${operation}".`);
    lastPermissionError = FIRESTORE_RULES_GUIDE;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("firestore-permission-error", { detail: FIRESTORE_RULES_GUIDE }));
    }
    return;
  }
  console.error(`Firestore error during "${operation}":`, err);
}

/* ─── Fetch helpers ─── */

async function fetchAll<T>(collectionName: string): Promise<(T & { id: string })[]> {
  const db = getDb();
  try {
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T & { id: string }));
  } catch (err) {
    handleDbError(err, `fetchAll(${collectionName})`);
    return [];
  }
}

/* ─── Donators ─── */

export async function getDonators(): Promise<Donator[]> {
  return fetchAll<Donator>(COLLECTIONS.donators);
}

export async function saveDonator(donator: Omit<Donator, "id" | "createdAt" | "updatedAt">): Promise<Donator> {
  const db = getDb();
  const now = new Date().toISOString();
  const id = generateId("don");
  const newDonator: Donator = { ...donator, id, createdAt: now, updatedAt: now };
  await setDoc(doc(db, COLLECTIONS.donators, id), {
    name: donator.name,
    village: donator.village,
    phone: donator.phone,
    email: donator.email,
    totalDonation: donator.totalDonation,
    lastDonationDate: donator.lastDonationDate,
    notes: donator.notes,
    createdAt: now,
    updatedAt: now,
  });
  return newDonator;
}

export async function updateDonator(id: string, updates: Partial<Donator>): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  await firestoreUpdateDoc(doc(db, COLLECTIONS.donators, id), { ...updates, updatedAt: now });
}

export async function deleteDonator(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, COLLECTIONS.donators, id));
}

/* ─── Accounts ─── */

export async function getAccounts(): Promise<Account[]> {
  return fetchAll<Account>(COLLECTIONS.accounts);
}

export async function saveAccount(account: Omit<Account, "id" | "createdAt" | "updatedAt">): Promise<Account> {
  const db = getDb();
  const now = new Date().toISOString();
  const id = generateId("acc");
  await setDoc(doc(db, COLLECTIONS.accounts, id), { ...account, createdAt: now, updatedAt: now });
  return { ...account, id, createdAt: now, updatedAt: now };
}

export async function updateAccount(id: string, updates: Partial<Account>): Promise<void> {
  const db = getDb();
  const now = new Date().toISOString();
  await firestoreUpdateDoc(doc(db, COLLECTIONS.accounts, id), { ...updates, updatedAt: now });
}

export async function deleteAccount(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, COLLECTIONS.accounts, id));
}

/* ─── Ledger ─── */

export async function getLedger(): Promise<LedgerEntry[]> {
  return fetchAll<LedgerEntry>(COLLECTIONS.ledger);
}

export async function saveLedgerEntry(entry: Omit<LedgerEntry, "id" | "createdAt" | "updatedAt">): Promise<LedgerEntry> {
  const db = getDb();
  const now = new Date().toISOString();
  const id = generateId("led");
  const newEntry: LedgerEntry = { ...entry, id, createdAt: now, updatedAt: now };
  await setDoc(doc(db, COLLECTIONS.ledger, id), {
    date: entry.date,
    type: entry.type,
    category: entry.category,
    amount: entry.amount,
    description: entry.description,
    accountId: entry.accountId,
    donatorId: entry.donatorId || null,
    reference: entry.reference,
    createdAt: now,
    updatedAt: now,
  });

  // Update account balance
  const accounts = await getAccounts();
  const acc = accounts.find((a) => a.id === entry.accountId);
  if (acc) {
    const newBalance = entry.type === "credit" ? acc.balance + entry.amount : acc.balance - entry.amount;
    await updateAccount(acc.id, { balance: newBalance });
  }

  // If donation, update donator total
  if (entry.category === "donation" && entry.donatorId) {
    const donators = await getDonators();
    const don = donators.find((d) => d.id === entry.donatorId);
    if (don) {
      await updateDonator(don.id, { totalDonation: don.totalDonation + entry.amount, lastDonationDate: entry.date });
    }
  }

  return newEntry;
}

export async function deleteLedgerEntry(id: string): Promise<void> {
  const db = getDb();
  const entries = await getLedger();
  const entry = entries.find((e) => e.id === id);
  if (!entry) return;

  await deleteDoc(doc(db, COLLECTIONS.ledger, id));

  // Reverse account balance
  if (entry.accountId) {
    const accounts = await getAccounts();
    const acc = accounts.find((a) => a.id === entry.accountId);
    if (acc) {
      const newBalance = entry.type === "credit" ? acc.balance - entry.amount : acc.balance + entry.amount;
      await updateAccount(acc.id, { balance: newBalance });
    }
  }
}

/* ─── Dashboard Stats ─── */

export async function getDashboardStats(): Promise<DashboardStats> {
  const donators = await getDonators();
  const ledger = await getLedger();
  const accounts = await getAccounts();

  const totalDonations = ledger.filter((e) => e.type === "credit").reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = ledger.filter((e) => e.type === "debit").reduce((sum, e) => sum + e.amount, 0);
  const balance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return {
    totalDonators: donators.length,
    totalDonations,
    totalExpenses,
    balance,
    recentTransactions: ledger.slice(0, 5),
    activeAccounts: accounts.length,
  };
}

/* ─── Enquiries ─── */

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  village: string;
  type: "poster" | "general" | "donation" | "seva";
  message: string;
  status: "new" | "read" | "resolved";
  createdAt: string;
}

export async function getEnquiries(): Promise<Enquiry[]> {
  return fetchAll<Enquiry>("enquiries");
}

export async function updateEnquiryStatus(id: string, status: Enquiry["status"]): Promise<void> {
  const db = getDb();
  await firestoreUpdateDoc(doc(db, "enquiries", id), { status });
}

export async function deleteEnquiry(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, "enquiries", id));
}

/* ─── Posters ─── */

export async function getPosters(): Promise<Poster[]> {
  return fetchAll<Poster>(COLLECTIONS.posters);
}

export async function savePoster(poster: Omit<Poster, "id" | "createdAt">): Promise<Poster> {
  const db = getDb();
  const now = new Date().toISOString();
  const id = generateId("pstr");
  await setDoc(doc(db, COLLECTIONS.posters, id), { ...poster, createdAt: now });
  return { ...poster, id, createdAt: now };
}

export async function deletePoster(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, COLLECTIONS.posters, id));
}
