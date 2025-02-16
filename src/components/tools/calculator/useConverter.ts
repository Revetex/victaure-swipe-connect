
import { useState } from 'react';
import { toast } from 'sonner';

const conversionRates = {
  currency: {
    CAD: 1,
    USD: 0.74,
    EUR: 0.68,
    GBP: 0.58,
    JPY: 109.82,
    CHF: 0.64,
    AUD: 1.12,
    NZD: 1.19
  },
  crypto: {
    BTC: 0.000017,
    ETH: 0.00031,
    USDT: 1,
    BNB: 0.0041,
    XRP: 1.67,
    ADA: 2.31,
    SOL: 0.025,
    DOGE: 14.27
  },
  stocks: {
    AAPL: 0.0047,
    MSFT: 0.0029,
    GOOGL: 0.0067,
    AMZN: 0.0051,
    TSLA: 0.0041,
    META: 0.0032,
    NVDA: 0.0022,
    TSX: 0.000058
  },
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
  const [conversionType, setConversionType] = useState("currency");
  const [fromUnit, setFromUnit] = useState("CAD");
  const [toUnit, setToUnit] = useState("USD");
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
      
      // Conversion via CAD comme monnaie de base
      if (conversionType === "currency" || conversionType === "crypto" || conversionType === "stocks") {
        result = (value / fromRate) * toRate;
      } else {
        result = (value / fromRate) * toRate;
      }
      
      setConversionResult(result.toFixed(4));
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
