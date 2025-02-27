
import React from 'react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CalculatorDisplayProps {
  value: string;
  className?: string;
}

export function CalculatorDisplay({ value, className }: CalculatorDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        value={value}
        readOnly
        className={cn(
          "text-right text-2xl font-mono glass-input mb-4",
          "border-2 focus:ring-2 ring-primary/20 shadow-inner",
          "bg-black/10 backdrop-blur-md py-6",
          className
        )}
      />
    </motion.div>
  );
}
