
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';

interface AccessRequestFormProps {
  onSuccess: () => void;
}

const AccessRequestForm = ({ onSuccess }: AccessRequestFormProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [subscription, setSubscription] = useState('monthly');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !email || !businessType) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to save data (you can replace this with actual API call)
    try {
      // In a real app, you would submit this data to your backend
      console.log('Form data:', { name, phone, email, businessType, subscription });
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Your request has been submitted successfully!",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name"
          placeholder="John Doe" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone"
          placeholder="+1 (555) 123-4567" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email"
          type="email"
          placeholder="your@email.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="businessType">Business Type</Label>
        <Input 
          id="businessType"
          placeholder="Retail, Restaurant, Consulting, etc." 
          value={businessType} 
          onChange={(e) => setBusinessType(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Subscription Package</Label>
        <RadioGroup value={subscription} onValueChange={setSubscription} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="monthly" id="monthly" />
            <Label htmlFor="monthly">Monthly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yearly" id="yearly" />
            <Label htmlFor="yearly">Yearly</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Button 
        type="submit" 
        className="w-full mt-4" 
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Request'}
      </Button>
    </form>
  );
};

export default AccessRequestForm;
