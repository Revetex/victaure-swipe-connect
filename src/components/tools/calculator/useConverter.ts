
import { useState } from 'react';
import { toast } from 'sonner';

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

export function useConverter() {
  const [conversionType, setConversionType] = useState("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [conversionValue, setConversionValue] = useState("");
  const [conversionResult, setConversionResult] = useState("");

  const handleConversion = async () => {
    if (!conversionValue || isNaN(Number(conversionValue))) {
      toast.error("Veuillez entrer une valeur numérique valide");
      return;
    }

    const value = parseFloat(conversionValue);
    let result = 0;

    try {
      if (conversionType === "currency") {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/CAD');
        const data = await response.json();
        
        // Convert to CAD first if not already in CAD
        const valueInCad = fromUnit === "CAD" ? value : value / data.rates[fromUnit];
        // Then convert to target currency
        result = valueInCad * data.rates[toUnit];
        
        setConversionResult(`${result.toFixed(2)} ${toUnit}`);
      } else if (conversionType === "temperature") {
        const tempFuncs = conversionRates.temperature;
        // Convert to Celsius first
        let tempInC = value;
        if (fromUnit === "f") {
          tempInC = (value - 32) * 5/9;
        } else if (fromUnit === "k") {
          tempInC = value - 273.15;
        }
        
        // Convert from Celsius to target unit
        if (toUnit === "f") {
          result = tempFuncs.f(tempInC);
        } else if (toUnit === "k") {
          result = tempFuncs.k(tempInC);
        } else {
          result = tempInC;
        }
        
        setConversionResult(result.toFixed(2));
      } else {
        const rates = conversionRates[conversionType as keyof typeof conversionRates];
        const fromRate = rates[fromUnit as keyof typeof rates] as number;
        const toRate = rates[toUnit as keyof typeof rates] as number;
        
        result = (value / fromRate) * toRate;
        setConversionResult(result.toFixed(2));
      }
    } catch (error) {
      console.error('Error during conversion:', error);
      toast.error("Une erreur est survenue lors de la conversion");
    }
  };

  return {
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
  };
}
