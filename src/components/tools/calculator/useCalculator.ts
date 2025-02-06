import { useState } from 'react';
import { toast } from 'sonner';

export function useCalculator() {
  const [display, setDisplay] = useState("0");
  const [firstNumber, setFirstNumber] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

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

  return {
    display,
    history,
    handleNumber,
    handleOperation,
    calculate,
    clear,
    clearHistory
  };
}