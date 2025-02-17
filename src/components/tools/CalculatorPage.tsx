
import { CalculatorDisplay } from "./calculator/CalculatorDisplay";
import { CalculatorKeypad } from "./calculator/CalculatorKeypad";
import { CalculatorHistory } from "./calculator/CalculatorHistory";
import { Converter } from "./calculator/Converter";
import { useCalculator } from "./calculator/useCalculator";
import { Card } from "@/components/ui/card";
import { PaymentSection } from "@/components/settings/PaymentSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import type { ConversionType } from "./calculator/types";

export function CalculatorPage() {
  const calculator = useCalculator();
  const [conversionType, setConversionType] = useState<ConversionType>("currency");
  const [fromUnit, setFromUnit] = useState("CAD");
  const [toUnit, setToUnit] = useState("USD");
  const [conversionValue, setConversionValue] = useState("");
  const [conversionResult, setConversionResult] = useState("");

  const handleConvert = () => {
    // Implémenter la logique de conversion ici
    console.log("Converting...");
  };

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <div className="container max-w-6xl mx-auto p-4 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card className="p-6">
              <CalculatorDisplay value={calculator.display} />
              <CalculatorKeypad 
                onNumber={calculator.handleNumber}
                onOperation={calculator.handleOperation}
                onCalculate={calculator.calculate}
                onClear={calculator.clear}
              />
            </Card>
            <CalculatorHistory history={calculator.history} />
          </div>
          <Converter 
            conversionType={conversionType}
            fromUnit={fromUnit}
            toUnit={toUnit}
            conversionValue={conversionValue}
            conversionResult={conversionResult}
            onConversionTypeChange={setConversionType}
            onFromUnitChange={setFromUnit}
            onToUnitChange={setToUnit}
            onValueChange={setConversionValue}
            onConvert={handleConvert}
          />
        </div>
        
        <PaymentSection />
      </div>
    </ScrollArea>
  );
}
