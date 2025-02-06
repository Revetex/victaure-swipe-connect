import React from 'react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CalculatorDisplayProps {
  value: string;
  className?: string;
}

export function CalculatorDisplay({ value, className }: CalculatorDisplayProps) {
  return (
    <Input
      value={value}
      readOnly
      className={cn(
        "text-right text-2xl font-mono bg-background/95 backdrop-blur",
        "supports-[backdrop-filter]:bg-background/60",
        "border-2 focus:ring-2 ring-primary/20",
        className
      )}
    />
  );
}