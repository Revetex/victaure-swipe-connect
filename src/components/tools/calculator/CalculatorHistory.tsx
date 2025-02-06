import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalculatorHistoryProps {
  history: string[];
}

export function CalculatorHistory({ history }: CalculatorHistoryProps) {
  return (
    <Card className="mb-4">
      <ScrollArea className="h-32 bg-muted/50 rounded-lg p-2">
        {history.map((item, index) => (
          <div key={index} className="text-sm text-muted-foreground">
            {item}
          </div>
        ))}
      </ScrollArea>
    </Card>
  );
}