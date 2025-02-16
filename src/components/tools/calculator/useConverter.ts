
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useExchangeRates } from './hooks/useExchangeRates';
import { calculateConversion } from './utils/conversionCalculator';
import type { ConversionType } from './types';

export function useConverter() {
  const [conversionType, setConversionType] = useState<ConversionType>("currency");
  const [fromUnit, setFromUnit] = useState("CAD");
  const [toUnit, setToUnit] = useState("USD");
  const [conversionValue, setConversionValue] = useState("");
  const [conversionResult, setConversionResult] = useState("");
  
  const { 
    exchangeRates, 
    cryptoRates, 
    loading, 
    fetchCurrencyRates, 
    fetchCryptoRates 
  } = useExchangeRates();

  useEffect(() => {
    if (conversionType === "currency") {
      fetchCurrencyRates();
    } else if (conversionType === "crypto") {
      fetchCryptoRates();
    }
  }, [conversionType]);

  const handleConversion = () => {
    if (!conversionValue || isNaN(Number(conversionValue))) {
      toast.error("Veuillez entrer une valeur numérique valide");
      return;
    }

    const value = parseFloat(conversionValue);
    const result = calculateConversion(
      value,
      fromUnit,
      toUnit,
      conversionType,
      exchangeRates,
      cryptoRates
    );

    const precision = conversionType === "crypto" ? 8 : 4;
    setConversionResult(result.toFixed(precision));
  };

  return {
    conversionType,
    fromUnit,
    toUnit,
    conversionValue,
    conversionResult,
    loading,
    setConversionType,
    setFromUnit,
    setToUnit,
    setConversionValue,
    handleConversion
  };
}
