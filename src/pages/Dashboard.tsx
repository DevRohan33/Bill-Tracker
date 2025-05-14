
import React from 'react';
import { useBill } from '@/contexts/BillContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SummaryCard from '@/components/dashboard/SummaryCard';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { totalIncome, totalExpenses, profit, bills } = useBill();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Financial Overview</h1>
        <p className="text-muted-foreground">Track your income and expenses</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        <SummaryCard 
          title="Total Income" 
          amount={totalIncome} 
          icon={<TrendingUp size={24} className="text-income" />} 
          variant="income"
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={totalExpenses} 
          icon={<TrendingDown size={24} className="text-expense" />} 
          variant="expense"
        />
        <SummaryCard 
          title="Profit / Loss" 
          amount={profit} 
          icon={<DollarSign size={24} className={profit >= 0 ? "text-profit" : "text-expense"} />} 
          variant="profit"
        />
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {bills.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No transactions yet. Add your first bill by clicking "Add Bill".
            </p>
          ) : (
            <div className="space-y-1">
              {bills.slice().reverse().slice(0, 5).map((bill) => (
                <div key={bill.id} className="flex justify-between py-2 border-b last:border-0">
                  <div>
                    <span className="font-medium">{bill.note || 'Untitled'}</span>
                    <p className="text-sm text-muted-foreground">
                      {bill.date.toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`font-semibold ${bill.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {bill.type === 'income' ? '+' : '-'}${bill.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
