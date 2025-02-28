
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export interface PaymentPanelProps {
  type: "deposit" | "withdraw";
  amount: string;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
}

export function PaymentPanel({
  type,
  amount,
  onAmountChange,
  onSubmit
}: PaymentPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      onSubmit();
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4 p-4 border border-border rounded-lg bg-card/50"
    >
      <h3 className="text-lg font-medium">
        {type === "deposit" ? "Déposer des fonds" : "Retirer des fonds"}
      </h3>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Montant (CAD)</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="bg-background/50"
        />
      </div>
      
      <Button 
        onClick={handleSubmit}
        className="w-full"
        disabled={isProcessing || !amount || parseFloat(amount) <= 0}
      >
        {isProcessing ? (
          <span className="flex items-center">
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
            Traitement...
          </span>
        ) : (
          type === "deposit" ? "Déposer" : "Retirer"
        )}
      </Button>
    </motion.div>
  );
}
