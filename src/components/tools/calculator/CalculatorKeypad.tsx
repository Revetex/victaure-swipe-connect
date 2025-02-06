import React from 'react';
import { Button } from "@/components/ui/button";
import { X, Divide, Plus, Minus, Equal } from "lucide-react";

interface CalculatorKeypadProps {
  onNumber: (num: string) => void;
  onOperation: (op: string) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function CalculatorKeypad({ onNumber, onOperation, onCalculate, onClear }: CalculatorKeypadProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {[7, 8, 9, "/", 4, 5, 6, "*", 1, 2, 3, "-", "C", 0, "=", "+"].map((btn) => (
        <Button
          key={btn}
          onClick={() => {
            if (typeof btn === "number") onNumber(btn.toString());
            else if (btn === "=") onCalculate();
            else if (btn === "C") onClear();
            else onOperation(btn);
          }}
          variant={typeof btn === "number" ? "outline" : "default"}
          className="h-12 text-lg font-semibold"
        >
          {btn === "*" ? <X className="h-4 w-4" /> :
           btn === "/" ? <Divide className="h-4 w-4" /> :
           btn === "+" ? <Plus className="h-4 w-4" /> :
           btn === "-" ? <Minus className="h-4 w-4" /> :
           btn === "=" ? <Equal className="h-4 w-4" /> :
           btn}
        </Button>
      ))}
    </div>
  );
}