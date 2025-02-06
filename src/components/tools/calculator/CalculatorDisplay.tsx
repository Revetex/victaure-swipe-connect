import React from 'react';
import { Input } from "@/components/ui/input";

interface CalculatorDisplayProps {
  value: string;
}

export function CalculatorDisplay({ value }: CalculatorDisplayProps) {
  return (
    <Input
      value={value}
      readOnly
      className="text-right text-2xl mb-4 font-mono bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    />
  );
}