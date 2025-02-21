
import { useState, useCallback } from 'react';
import { useExchangeRates } from './useExchangeRates';
import type { ConversionType } from '../types';
import { toast } from 'sonner';

function convertTemperature(value: number, from: 'c' | 'f' | 'k', to: 'c' | 'f' | 'k'): number {
  let celsius = value;
  
  if (from === 'f') {
    celsius = (value - 32) * 5/9;
  } else if (from === 'k') {
    celsius = value - 273.15;
  }
  
  if (to === 'f') {
    return Number((celsius * 9/5 + 32).toFixed(2));
  } else if (to === 'k') {
    return Number((celsius + 273.15).toFixed(2));
  }
  
  return Number(celsius.toFixed(2));
}

function convertUnit(value: number, from: string, to: string, type: ConversionType): number {
  const conversionRates: Record<ConversionType, Record<string, number>> = {
    length: { m: 1, km: 0.001, cm: 100, mm: 1000, ft: 3.28084, in: 39.3701 },
    weight: { kg: 1, g: 1000, mg: 1000000, lb: 2.20462, oz: 35.274 },
    time: { s: 1, min: 1/60, h: 1/3600, d: 1/86400 },
    unit: { u: 1, dz: 1/12, c: 1/100, k: 1/1000 },
    currency: {}, // Handled by useExchangeRates
    crypto: {}, // Handled by useExchangeRates
    temperature: {} // Handled by convertTemperature
  };

  const rates = conversionRates[type];
  if (!rates[from] || !rates[to]) return value;

  const baseValue = value / rates[from];
  return Number((baseValue * rates[to]).toFixed(2));
}

export function useConverter() {
  const [conversionType, setConversionType] = useState<ConversionType>("currency");
  const [fromUnit, setFromUnit] = useState("CAD");
  const [toUnit, setToUnit] = useState("USD");
  const [conversionValue, setConversionValue] = useState("");
  const [conversionResult, setConversionResult] = useState("");
  
  const { rates, loading, error, convertAmount } = useExchangeRates();

  const handleConversion = useCallback(() => {
    if (!conversionValue || isNaN(Number(conversionValue))) {
      toast.error("Veuillez entrer une valeur numérique valide");
      return;
    }

    if (loading) {
      toast.error("Chargement des taux de change en cours...");
      return;
    }

    if (error) {
      toast.error("Erreur lors de la conversion. Veuillez réessayer.");
      return;
    }

    const value = parseFloat(conversionValue);
    let result: number | string = 0;

    try {
      switch (conversionType) {
        case "currency":
        case "crypto":
          if (!rates?.rates) {
            throw new Error("Taux de change non disponibles");
          }
          result = convertAmount(value, fromUnit, toUnit);
          break;
        case "temperature":
          result = convertTemperature(value, fromUnit as 'c' | 'f' | 'k', toUnit as 'c' | 'f' | 'k');
          break;
        case "length":
        case "weight":
        case "time":
        case "unit":
          result = convertUnit(value, fromUnit, toUnit, conversionType);
          break;
      }

      setConversionResult(`${value} ${fromUnit} = ${result} ${toUnit}`);
    } catch (err) {
      console.error('Conversion error:', err);
      toast.error("Erreur lors de la conversion. Veuillez réessayer.");
    }
  }, [conversionType, conversionValue, fromUnit, toUnit, rates, loading, error, convertAmount]);

  return {
    conversionType,
    fromUnit,
    toUnit,
    conversionValue,
    conversionResult,
    loading,
    error,
    setConversionType,
    setFromUnit,
    setToUnit,
    setConversionValue,
    handleConversion
  };
}
