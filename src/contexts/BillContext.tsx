
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type BillType = 'income' | 'expense';

export interface Bill {
  id: string;
  amount: number;
  type: BillType;
  note: string;
  date: Date;
  file?: File | null;
}

interface BillContextType {
  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id'>) => void;
  totalIncome: number;
  totalExpenses: number;
  profit: number;
}

const BillContext = createContext<BillContextType | undefined>(undefined);

export const BillProvider = ({ children }: { children: ReactNode }) => {
  const [bills, setBills] = useState<Bill[]>([]);

  const addBill = (bill: Omit<Bill, 'id'>) => {
    const newBill = {
      ...bill,
      id: crypto.randomUUID(),
    };
    setBills((prevBills) => [...prevBills, newBill]);
  };

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
        addBill,
        totalIncome,
        totalExpenses,
        profit,
      }}
    >
      {children}
    </BillContext.Provider>
  );
};

export const useBill = (): BillContextType => {
  const context = useContext(BillContext);
  if (context === undefined) {
    throw new Error('useBill must be used within a BillProvider');
  }
  return context;
};
