import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator as CalculatorIcon, ArrowRightLeft } from "lucide-react";
import { useCalculator } from "./calculator/useCalculator";
import { useConverter } from "./calculator/useConverter";
import { CalculatorDisplay } from "./calculator/CalculatorDisplay";
import { CalculatorKeypad } from "./calculator/CalculatorKeypad";
import { Converter } from "./calculator/Converter";

export function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<"calculator" | "converter">("calculator");
  const {
    display,
    handleNumber,
    handleOperation,
    calculate,
    clear
  } = useCalculator();

  const {
    conversionType,
    fromUnit,
    toUnit,
    conversionValue,
    conversionResult,
    setConversionType,
    setFromUnit,
    setToUnit,
    setConversionValue,
    handleConversion
  } = useConverter();

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <Card className="overflow-hidden shadow-lg">
        <Tabs defaultValue="calculator" className="w-full">
          <div className="border-b px-4 py-2 bg-muted/50">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger 
                value="calculator"
                className="flex items-center gap-2 data-[state=active]:bg-background"
                onClick={() => setActiveTab("calculator")}
              >
                <CalculatorIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Calculatrice</span>
              </TabsTrigger>
              <TabsTrigger 
                value="converter"
                className="flex items-center gap-2 data-[state=active]:bg-background"
                onClick={() => setActiveTab("converter")}
              >
                <ArrowRightLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Convertisseur</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calculator" className="m-0">
            <div className="p-4 space-y-4">
              <CalculatorDisplay value={display} />
              <CalculatorKeypad
                onNumber={handleNumber}
                onOperation={handleOperation}
                onCalculate={calculate}
                onClear={clear}
              />
            </div>
          </TabsContent>

          <TabsContent value="converter" className="m-0">
            <div className="p-4">
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
                onConvert={handleConversion}
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}