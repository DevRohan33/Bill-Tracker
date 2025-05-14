
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  className?: string;
  variant?: 'income' | 'expense' | 'profit';
}

const SummaryCard = ({ title, amount, icon, className, variant = 'income' }: SummaryCardProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'income':
        return 'text-income bg-green-50 border-green-100';
      case 'expense':
        return 'text-expense bg-red-50 border-red-100';
      case 'profit':
        return amount >= 0 
          ? 'text-profit bg-blue-50 border-blue-100' 
          : 'text-expense bg-red-50 border-red-100';
      default:
        return 'bg-white';
    }
  };

  return (
    <Card className={cn('card-hover border', getVariantClasses(), className)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-1">
              ${Math.abs(amount).toFixed(2)}
              {variant === 'profit' && amount < 0 && ' (Loss)'}
            </h3>
          </div>
          <div className="p-2 rounded-full bg-white/80 shadow-sm">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
