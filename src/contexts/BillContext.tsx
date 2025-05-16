import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export type BillType = 'income' | 'expense';

export interface Bill {
  id: string;
  title: string;
  amount: number;
  type: BillType;
  note: string;
  date: Date;
  fileURL?: string | null;
}

interface BillContextType {
  bills: Bill[];
  totalIncome: number;
  totalExpenses: number;
  profit: number;
}

const BillContext = createContext<BillContextType | undefined>(undefined);

function BillProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<Bill[]>([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'users', user.uid, 'bills'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBills: Bill[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          amount: data.amount,
          type: data.type,
          note: data.note,
          date: data.date?.toDate?.() || new Date(),
          fileURL: data.fileURL || null,
        };
      });
      setBills(fetchedBills);
    });

    return () => unsubscribe();
  }, [user]);

  const totalIncome = bills
    .filter((bill) => bill.type === 'income')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const totalExpenses = bills
    .filter((bill) => bill.type === 'expense')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const profit = totalIncome - totalExpenses;

  return (
    <BillContext.Provider
      value={{
        bills,
        totalIncome,
        totalExpenses,
        profit,
      }}
    >
      {children}
    </BillContext.Provider>
  );
}

function useBill(): BillContextType {
  const context = useContext(BillContext);
  if (context === undefined) {
    throw new Error('useBill must be used within a BillProvider');
  }
  return context;
}

export { BillProvider, useBill };
