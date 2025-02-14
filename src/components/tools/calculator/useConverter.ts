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

  const handleConversion = () => {
    if (!conversionValue || isNaN(Number(conversionValue))) {
      toast.error("Veuillez entrer une valeur numérique valide");
      return;
    }

    const value = parseFloat(conversionValue);
    let result = 0;

    if (conversionType === "temperature") {
      const fromTemp = conversionRates.temperature[fromUnit as keyof typeof conversionRates.temperature](value);
      let toTemp = fromTemp;
      
      if (toUnit === "f") {
        toTemp = (fromTemp * 9/5) + 32;
      } else if (toUnit === "k") {
        toTemp = fromTemp + 273.15;
      }
      
      setConversionResult(toTemp.toFixed(2));
    } else {
      const rates = conversionRates[conversionType as keyof typeof conversionRates];
      const fromRate = rates[fromUnit as keyof typeof rates] as number;
      const toRate = rates[toUnit as keyof typeof rates] as number;
      
      result = (value / fromRate) * toRate;
      setConversionResult(result.toFixed(2));
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