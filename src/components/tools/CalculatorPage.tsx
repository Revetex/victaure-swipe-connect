import React from "react";
import { Button } from "@/components/ui/button";
import { Calculator as CalcIcon, ArrowRightLeft, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatorDisplay } from "./calculator/CalculatorDisplay";
import { CalculatorHistory } from "./calculator/CalculatorHistory";
import { CalculatorKeypad } from "./calculator/CalculatorKeypad";
import { Converter } from "./calculator/Converter";
import { useCalculator } from "./calculator/useCalculator";
import { useConverter } from "./calculator/useConverter";

export function CalculatorPage() {
  const {
    display,
    history,
    handleNumber,
    handleOperation,
    calculate,
    clear,
    clearHistory
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
    <div className="container mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border p-6 shadow-lg"
      >
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <CalcIcon className="h-4 w-4" />
              Calculatrice
            </TabsTrigger>
            <TabsTrigger value="converter" className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Convertisseur
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CalcIcon className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Calculatrice</h1>
              </div>
              <Button variant="outline" size="icon" onClick={clearHistory}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <CalculatorHistory history={history} />
            <CalculatorDisplay value={display} />
            <CalculatorKeypad
              onNumber={handleNumber}
              onOperation={handleOperation}
              onCalculate={calculate}
              onClear={clear}
            />
          </TabsContent>

          <TabsContent value="converter" className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <ArrowRightLeft className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Convertisseur</h1>
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
              onConvert={handleConversion}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}