
import React, { useState } from 'react';
import { useBill } from '@/contexts/BillContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SummaryCard from '@/components/dashboard/SummaryCard';
import { TrendingUp, TrendingDown, DollarSign, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TransactionDetail from '@/components/dashboard/TransactionDetail';

const Dashboard = () => {
  const { totalIncome, totalExpenses, profit, bills } = useBill();
  const [timeFilter, setTimeFilter] = useState<'all' | 'yearly' | 'monthly'>('all');
  const [selectedBill, setSelectedBill] = useState<string | null>(null);
  
  // Filter bills based on the selected time period
  const filterBillsByTime = () => {
    const now = new Date();
    
    if (timeFilter === 'all') return bills;
    
    if (timeFilter === 'yearly') {
      return bills.filter(bill => bill.date.getFullYear() === now.getFullYear());
    }
    
    if (timeFilter === 'monthly') {
      return bills.filter(
        bill => bill.date.getMonth() === now.getMonth() && 
               bill.date.getFullYear() === now.getFullYear()
      );
    }
    
    return bills;
  };
  
  const filteredBills = filterBillsByTime();
  
  // Calculate summaries for the filtered bills
  const filteredIncome = filteredBills
    .filter(bill => bill.type === 'income')
    .reduce((sum, bill) => sum + bill.amount, 0);
  
  const filteredExpenses = filteredBills
    .filter(bill => bill.type === 'expense')
    .reduce((sum, bill) => sum + bill.amount, 0);
  
  const filteredProfit = filteredIncome - filteredExpenses;
  
  const handleDownload = () => {
    // Create financial overview section
    const overviewSection = [
      'Financial Overview',
      `Time Period: ${timeFilter === 'all' ? 'All Time' : timeFilter === 'yearly' ? 'This Year' : 'This Month'}`,
      `Total Income: $${filteredIncome.toFixed(2)}`,
      `Total Expenses: $${filteredExpenses.toFixed(2)}`,
      `Profit/Loss: $${filteredProfit.toFixed(2)}`,
      '',
      '---------------------------------------------',
      ''
    ].join('\n');
    
    // Create detailed transaction data
    const headers = 'Title,Date,Type,Amount,Description\n';
    const transactionData = filteredBills.map(bill => 
      `"${bill.title || 'Untitled'}",${bill.date.toLocaleDateString()},"${bill.type}",${bill.amount.toFixed(2)},"${bill.note || ''}"`
    ).join('\n');
    
    const blob = new Blob([overviewSection + headers + transactionData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `bill-tracker-${timeFilter}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Financial Overview</h1>
          <p className="text-muted-foreground">Track your income and expenses</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as 'all' | 'yearly' | 'monthly')}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="yearly">This Year</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2" onClick={handleDownload}>
            <Download size={16} />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        <SummaryCard 
          title="Total Income" 
          amount={filteredIncome} 
          icon={<TrendingUp size={24} className="text-income" />} 
          variant="income"
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={filteredExpenses} 
          icon={<TrendingDown size={24} className="text-expense" />} 
          variant="expense"
        />
        <SummaryCard 
          title="Profit / Loss" 
          amount={filteredProfit} 
          icon={<DollarSign size={24} className={filteredProfit >= 0 ? "text-profit" : "text-expense"} />} 
          variant="profit"
        />
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <span className="text-sm text-muted-foreground">
            {filteredBills.length} {filteredBills.length === 1 ? 'transaction' : 'transactions'}
          </span>
        </CardHeader>
      <CardContent>
        {filteredBills.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No transactions yet. Add your first bill by clicking "Add Bill".
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-1 pr-2">
            {[...filteredBills].reverse().map((bill) => (
              <div 
                key={bill.id} 
                className="flex justify-between py-2 border-b last:border-0 hover:bg-gray-50 cursor-pointer p-2 rounded-md transition-colors"
                onClick={() => setSelectedBill(bill.id)}
              >
                <div>
                  <span className="font-medium">{bill.title || 'Untitled'}</span>
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
      
      {/* Transaction Detail Modal */}
      {selectedBill && (
        <TransactionDetail 
          billId={selectedBill} 
          onClose={() => setSelectedBill(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
