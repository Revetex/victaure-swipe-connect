import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator as CalcIcon, Plus, Minus, X, Divide, Equal, RotateCcw, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const conversionRates = {
  length: {
    m: 1,
    km: 0.001,
    cm: 100,
    mm: 1000,
    ft: 3.28084,
    in: 39.3701,
  },
  weight: {
    kg: 1,
    g: 1000,
    mg: 1000000,
    lb: 2.20462,
    oz: 35.274,
  },
  temperature: {
    c: (value: number) => value,
    f: (value: number) => (value * 9/5) + 32,
    k: (value: number) => value + 273.15,
  }
};

export function CalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [firstNumber, setFirstNumber] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  // Converter state
  const [conversionType, setConversionType] = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [conversionValue, setConversionValue] = useState("");
  const [conversionResult, setConversionResult] = useState("");

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    setFirstNumber(parseFloat(display));
    setOperation(op);
    setNewNumber(true);
    setHistory([...history, `${display} ${op}`]);
  };

  const calculate = () => {
    if (firstNumber === null || operation === null) return;
    
    const secondNumber = parseFloat(display);
    let result = 0;

    switch (operation) {
      case "+":
        result = firstNumber + secondNumber;
        break;
      case "-":
        result = firstNumber - secondNumber;
        break;
      case "*":
        result = firstNumber * secondNumber;
        break;
      case "/":
        if (secondNumber === 0) {
          toast.error("Division par zéro impossible");
          clear();
          return;
        }
        result = firstNumber / secondNumber;
        break;
    }

    const calculation = `${firstNumber} ${operation} ${secondNumber} = ${result}`;
    setHistory([...history, calculation]);
    setDisplay(result.toString());
    setFirstNumber(null);
    setOperation(null);
    setNewNumber(true);
  };

  const clear = () => {
    setDisplay("0");
    setFirstNumber(null);
    setOperation(null);
    setNewNumber(true);
  };

  const clearHistory = () => {
    setHistory([]);
    toast.success("Historique effacé");
  };

  const handleConversion = () => {
    if (!conversionValue || isNaN(Number(conversionValue))) {
      toast.error("Veuillez entrer une valeur numérique valide");
      return;
    }

    const value = parseFloat(conversionValue);
    let result = 0;

    if (conversionType === "temperature") {
      // Handle temperature conversion separately
      const fromTemp = conversionRates.temperature[fromUnit as keyof typeof conversionRates.temperature](value);
      let toTemp = fromTemp;
      
      if (toUnit === "f") {
        toTemp = (fromTemp * 9/5) + 32;
      } else if (toUnit === "k") {
        toTemp = fromTemp + 273.15;
      }
      
      setConversionResult(toTemp.toFixed(2));
    } else {
      // Handle other conversions
      const rates = conversionRates[conversionType as keyof typeof conversionRates];
      const fromRate = rates[fromUnit as keyof typeof rates] as number;
      const toRate = rates[toUnit as keyof typeof rates] as number;
      
      result = (value / fromRate) * toRate;
      setConversionResult(result.toFixed(2));
    }
  };

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

            <Card className="mb-4">
              <div className="h-32 overflow-y-auto bg-muted/50 rounded-lg p-2">
                {history.map((item, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </Card>

            <Input
              value={display}
              readOnly
              className="text-right text-2xl mb-4 font-mono"
            />

            <div className="grid grid-cols-4 gap-2">
              {[7, 8, 9, "/", 4, 5, 6, "*", 1, 2, 3, "-", "C", 0, "=", "+"].map((btn) => (
                <Button
                  key={btn}
                  onClick={() => {
                    if (typeof btn === "number") handleNumber(btn.toString());
                    else if (btn === "=") calculate();
                    else if (btn === "C") clear();
                    else handleOperation(btn);
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
          </TabsContent>

          <TabsContent value="converter" className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <ArrowRightLeft className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Convertisseur</h1>
            </div>

            <div className="space-y-4">
              <Select value={conversionType} onValueChange={setConversionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de conversion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="length">Longueur</SelectItem>
                  <SelectItem value="weight">Poids</SelectItem>
                  <SelectItem value="temperature">Température</SelectItem>
                </SelectContent>
              </Select>

              <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conversionType === "length" && [
                      ["m", "Mètres"],
                      ["km", "Kilomètres"],
                      ["cm", "Centimètres"],
                      ["mm", "Millimètres"],
                      ["ft", "Pieds"],
                      ["in", "Pouces"],
                    ].map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                    {conversionType === "weight" && [
                      ["kg", "Kilogrammes"],
                      ["g", "Grammes"],
                      ["mg", "Milligrammes"],
                      ["lb", "Livres"],
                      ["oz", "Onces"],
                    ].map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                    {conversionType === "temperature" && [
                      ["c", "Celsius"],
                      ["f", "Fahrenheit"],
                      ["k", "Kelvin"],
                    ].map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <ArrowRightLeft className="h-4 w-4" />

                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conversionType === "length" && [
                      ["m", "Mètres"],
                      ["km", "Kilomètres"],
                      ["cm", "Centimètres"],
                      ["mm", "Millimètres"],
                      ["ft", "Pieds"],
                      ["in", "Pouces"],
                    ].map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                    {conversionType === "weight" && [
                      ["kg", "Kilogrammes"],
                      ["g", "Grammes"],
                      ["mg", "Milligrammes"],
                      ["lb", "Livres"],
                      ["oz", "Onces"],
                    ].map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                    {conversionType === "temperature" && [
                      ["c", "Celsius"],
                      ["f", "Fahrenheit"],
                      ["k", "Kelvin"],
                    ].map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                type="number"
                value={conversionValue}
                onChange={(e) => setConversionValue(e.target.value)}
                placeholder="Entrez une valeur..."
                className="text-right"
              />

              <Button onClick={handleConversion} className="w-full">
                Convertir
              </Button>

              {conversionResult && (
                <Card className="p-4 text-center">
                  <p className="text-lg font-semibold">{conversionResult}</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}