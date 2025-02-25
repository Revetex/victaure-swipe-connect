
import { useState } from 'react';
import { toast } from 'sonner';

export function useCalculator() {
  const [display, setDisplay] = useState("0");
  const [firstNumber, setFirstNumber] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState<number>(0);

  const handleNumber = (num: string) => {
    if (display === "Error") {
      setDisplay(num);
      setNewNumber(false);
      return;
    }

    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      // Empêcher plusieurs points décimaux
      if (num === "." && display.includes(".")) return;
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    if (display === "Error") {
      toast.error("Veuillez d'abord effacer l'erreur");
      return;
    }

    const currentNumber = parseFloat(display);
    
    if (firstNumber === null) {
      setFirstNumber(currentNumber);
      setOperation(op);
      setNewNumber(true);
      setHistory([...history, `${display} ${op}`]);
    } else {
      calculate();
      setOperation(op);
    }
  };

  const calculate = () => {
    if (firstNumber === null || operation === null) return;
    
    const secondNumber = parseFloat(display);
    let result = 0;

    try {
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
            throw new Error("Division par zéro impossible");
          }
          result = firstNumber / secondNumber;
          break;
      }

      if (!isFinite(result)) {
        throw new Error("Résultat invalide");
      }

      const calculation = `${firstNumber} ${operation} ${secondNumber} = ${result}`;
      setHistory([...history, calculation]);
      setDisplay(result.toString());
      setFirstNumber(null);
      setOperation(null);
      setNewNumber(true);

    } catch (error) {
      setDisplay("Error");
      toast.error(error instanceof Error ? error.message : "Erreur de calcul");
      setFirstNumber(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setFirstNumber(null);
    setOperation(null);
    setNewNumber(true);
    toast.success("Calculatrice réinitialisée");
  };

  const clearHistory = () => {
    setHistory([]);
    toast.success("Historique effacé");
  };

  const addToMemory = () => {
    setMemory(memory + parseFloat(display));
    toast.success("Valeur ajoutée à la mémoire");
  };

  const subtractFromMemory = () => {
    setMemory(memory - parseFloat(display));
    toast.success("Valeur soustraite de la mémoire");
  };

  const recallMemory = () => {
    setDisplay(memory.toString());
    setNewNumber(true);
  };

  const clearMemory = () => {
    setMemory(0);
    toast.success("Mémoire effacée");
  };

  return {
    display,
    history,
    memory,
    handleNumber,
    handleOperation,
    calculate,
    clear,
    clearHistory,
    addToMemory,
    subtractFromMemory,
    recallMemory,
    clearMemory
  };
}
