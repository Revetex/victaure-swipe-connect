import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator as CalcIcon, Plus, Minus, X, Divide, Equal } from "lucide-react";
import { motion } from "framer-motion";

export function CalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [firstNumber, setFirstNumber] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

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
        result = secondNumber !== 0 ? firstNumber / secondNumber : NaN;
        break;
    }

    setDisplay(isNaN(result) ? "Error" : result.toString());
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

  return (
    <div className="container mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border p-6 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-6">
          <CalcIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Calculatrice</h1>
        </div>

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
      </motion.div>
    </div>
  );
}