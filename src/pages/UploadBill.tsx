
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FileUploadPreview from "@/components/upload/FileUploadPreview";
import { Textarea } from "@/components/ui/textarea";
import { useBill, BillType } from "@/contexts/BillContext";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface FormValues {
  amount: number;
  type: BillType;
  note: string;
  date: Date;
  file?: FileList;
}

const UploadBill = () => {
  const [entryType, setEntryType] = useState<'manual' | 'file'>('manual');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { addBill } = useBill();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      amount: 0,
      type: 'expense',
      note: '',
      date: new Date(),
    }
  });

  const selectedDate = watch('date');
  const selectedType = watch('type');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = (data: FormValues) => {
    // Convert string amount to number
    const amountNumber = parseFloat(data.amount.toString());
    
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than zero",
        variant: "destructive"
      });
      return;
    }

    addBill({
      amount: amountNumber,
      type: data.type,
      note: data.note,
      date: data.date,
      file: selectedFile
    });

    toast({
      title: "Success!",
      description: `${data.type === 'income' ? 'Income' : 'Expense'} of $${amountNumber} has been added.`
    });

    // Reset form and redirect to dashboard
    reset();
    setSelectedFile(null);
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Bill</h1>
        <p className="text-muted-foreground">Record your income or expense</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entry Method</CardTitle>
          <CardDescription>Choose how to add your bill</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Entry Type Toggle */}
          <div className="flex space-x-4 mb-6">
            <Button
              type="button"
              variant={entryType === 'manual' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setEntryType('manual')}
            >
              Manual Entry
            </Button>
            <Button
              type="button"
              variant={entryType === 'file' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setEntryType('file')}
            >
              File Upload
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* File Upload (conditional) */}
            {entryType === 'file' && (
              <div className="space-y-2">
                <Label htmlFor="file">Upload Bill</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <FileUploadPreview
                  file={selectedFile}
                  onClear={() => setSelectedFile(null)}
                />
              </div>
            )}

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register("amount", { required: true, min: 0 })}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">Please enter a valid amount</p>
              )}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <RadioGroup
                value={selectedType}
                onValueChange={(value) => setValue('type', value as BillType)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income" className="text-income">Income</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense" className="text-expense">Expense</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add details about this transaction"
                {...register("note")}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setValue("date", date || new Date())}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadBill;
