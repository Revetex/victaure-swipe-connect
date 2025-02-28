
import { useState, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

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
}: PaymentPanelProps): ReactNode {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex">
          <div className="px-4 py-2 bg-muted rounded-l-md border-r border-border w-16 flex items-center justify-center text-muted-foreground">
            CAD
          </div>
          <Input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="Montant"
            className="rounded-l-none"
          />
        </div>
      </div>
      <Button 
        className="w-full" 
        onClick={onSubmit}
      >
        {type === "deposit" ? "Déposer" : "Retirer"}
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
