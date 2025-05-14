
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, FileText, FileInput } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FileUploadPreview from "@/components/upload/FileUploadPreview";
import { Textarea } from "@/components/ui/textarea";
import { useBill, BillType } from "@/contexts/BillContext";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface FormValues {
  title: string;
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
      title: '',
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

    if (!data.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a transaction title",
        variant: "destructive"
      });
      return;
    }

    addBill({
      title: data.title.trim(),
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
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Bill</h1>
        <p className="text-muted-foreground">Record your income or expense</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Entry Method</CardTitle>
              <CardDescription>Choose how to add your bill</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Entry Type Toggle */}
              <div className="flex space-x-4 mb-8">
                <Button
                  type="button"
                  variant={entryType === 'manual' ? 'default' : 'outline'}
                  className="flex-1 py-6"
                  onClick={() => setEntryType('manual')}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Manual Entry
                </Button>
                <Button
                  type="button"
                  variant={entryType === 'file' ? 'default' : 'outline'}
                  className="flex-1 py-6"
                  onClick={() => setEntryType('file')}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  File Upload
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* File Upload (conditional) */}
                {entryType === 'file' && (
                  <div className="space-y-2">
                    <Label htmlFor="file" className="text-base">Upload Bill</Label>
                    <Input
                      id="file"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="cursor-pointer h-auto py-3"
                    />
                    <FileUploadPreview
                      file={selectedFile}
                      onClear={() => setSelectedFile(null)}
                    />
                  </div>
                )}

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base">Transaction Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter transaction title"
                    {...register("title", { required: true })}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">Transaction title is required</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-base">Amount ($) *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-8"
                        {...register("amount", { required: true, min: 0 })}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-sm text-destructive">Please enter a valid amount</p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Label className="text-base">Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-10",
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
                </div>

                {/* Type */}
                <div className="space-y-3">
                  <Label className="text-base">Transaction Type *</Label>
                  <RadioGroup
                    value={selectedType}
                    onValueChange={(value) => setValue('type', value as BillType)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-md border">
                      <RadioGroupItem value="income" id="income" />
                      <Label htmlFor="income" className="text-income font-medium">Income</Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-md border">
                      <RadioGroupItem value="expense" id="expense" />
                      <Label htmlFor="expense" className="text-expense font-medium">Expense</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Description (formerly Note) */}
                <div className="space-y-2">
                  <Label htmlFor="note" className="text-base">Description (Optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Add details about this transaction"
                    className="min-h-24"
                    {...register("note")}
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full py-6 text-lg mt-8">
                  Save Transaction
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-lg h-auto">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Quick Tips</CardTitle>
              <CardDescription>How to use this page</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-medium mb-1">Transaction Title</h3>
                  <p className="text-sm text-muted-foreground">Enter a clear name to easily identify your transaction later.</p>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-medium mb-1">Manual Entry</h3>
                  <p className="text-sm text-muted-foreground">Enter transaction details manually for quick recording.</p>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-medium mb-1">File Upload</h3>
                  <p className="text-sm text-muted-foreground">Upload receipts, invoices or bills as images or PDFs.</p>
                </div>
                
                <div className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-medium mb-1">Transaction Types</h3>
                  <p className="text-sm text-muted-foreground">Choose 'Income' for money received and 'Expense' for money spent.</p>
                </div>
                
                <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Pro Tip</h3>
                  <p className="text-sm text-muted-foreground">All transactions are immediately reflected on your dashboard and can be downloaded in reports.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadBill;
