
import { CalculatorDisplay } from "./calculator/CalculatorDisplay";
import { CalculatorKeypad } from "./calculator/CalculatorKeypad";
import { CalculatorHistory } from "./calculator/CalculatorHistory";
import { Converter } from "./calculator/Converter";
import { useCalculator } from "./calculator/useCalculator";
import { Card } from "@/components/ui/card";
import { PaymentSection } from "@/components/settings/PaymentSection";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CalculatorPage() {
  const calculator = useCalculator();

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <div className="container max-w-6xl mx-auto p-4 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card className="p-6">
              <CalculatorDisplay value={calculator.display} />
              <CalculatorKeypad onKeyPress={calculator.handleKeyPress} />
            </Card>
            <CalculatorHistory history={calculator.history} />
          </div>
          <Converter />
        </div>
        
        <PaymentSection />
      </div>
    </ScrollArea>
  );
}
