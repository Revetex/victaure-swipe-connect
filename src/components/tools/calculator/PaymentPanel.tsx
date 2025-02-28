import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TransactionType } from "./types";
import { toast } from "sonner";
interface PaymentPanelProps {
  type: TransactionType;
  amount: number;
  onAmountChange: (amount: number) => void;
  onSubmit: () => void;
}
export function PaymentPanel({
  type,
  amount,
  onAmountChange,
  onSubmit
}: PaymentPanelProps) {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onAmountChange(value);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      toast.error("Le montant doit être supérieur à 0");
      return;
    }
    onSubmit();
  };
  return;
}