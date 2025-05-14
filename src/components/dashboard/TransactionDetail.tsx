
import React from 'react';
import { useBill } from '@/contexts/BillContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Calendar, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionDetailProps {
  billId: string;
  onClose: () => void;
}

const TransactionDetail = ({ billId, onClose }: TransactionDetailProps) => {
  const { bills } = useBill();
  
  const bill = bills.find(b => b.id === billId);
  
  if (!bill) return null;

  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Description</span>
            <span className="font-medium">{bill.note || 'Untitled'}</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Amount</span>
            <span className={`text-xl font-semibold ${bill.type === 'income' ? 'text-income' : 'text-expense'}`}>
              {bill.type === 'income' ? '+' : '-'}${bill.amount.toFixed(2)}
            </span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Type</span>
            <span className="capitalize font-medium">{bill.type}</span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Date</span>
            <div className="flex items-center">
              <Calendar className="mr-2 size-4 text-muted-foreground" />
              <span>{bill.date.toLocaleDateString()}</span>
            </div>
          </div>
          
          {bill.file && (
            <div className="mt-4">
              <span className="text-sm font-medium text-muted-foreground mb-2 block">Attached File</span>
              <div className="border rounded-lg p-4 bg-muted/20">
                {bill.file.type.startsWith('image/') ? (
                  <div>
                    <img 
                      src={URL.createObjectURL(bill.file)} 
                      alt="Receipt" 
                      className="max-w-full h-auto rounded-md mx-auto max-h-[300px] object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-4">
                    <FileImage size={48} className="text-muted-foreground" />
                    <span className="ml-2">{bill.file.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetail;
