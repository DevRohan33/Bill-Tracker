
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import AccessRequestForm from './AccessRequestForm';

const AccessRequestSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Need a Simple Billing Solution for Your Business?</h2>
        <p className="text-gray-600">
          We provide a smart, web-based bill tracking solution tailored for small business owners. 
          No setup needed. Start tracking your income and expenses instantly.
        </p>
        
        <ul className="space-y-2 mt-6">
          <li className="flex items-center gap-2">
            <div className="bg-primary/20 text-primary p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span>Easy to use dashboard</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="bg-primary/20 text-primary p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span>Track income and expenses</span>
          </li>
          <li className="flex items-center gap-2">
            <div className="bg-primary/20 text-primary p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span>Export financial reports</span>
          </li>
        </ul>
      </div>

      <Button 
        onClick={() => setIsDialogOpen(true)} 
        size="lg" 
        className="w-full"
      >
        Request Access / Subscribe
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Access</DialogTitle>
            <DialogDescription>
              Fill out this form to request access to our bill tracking solution.
            </DialogDescription>
          </DialogHeader>
          <AccessRequestForm onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccessRequestSection;
