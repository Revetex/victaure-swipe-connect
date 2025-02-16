
import { conversionRates } from './conversionRates';
import { ExchangeRates } from '../types';

export function calculateConversion(
  value: number,
  fromUnit: string,
  toUnit: string,
  conversionType: string,
  exchangeRates?: ExchangeRates,
  cryptoRates?: ExchangeRates
): number {
  if (conversionType === "temperature") {
    const fromTemp = conversionRates.temperature[fromUnit as keyof typeof conversionRates.temperature](value);
    let toTemp = fromTemp;
    
    if (toUnit === "f") {
      toTemp = (fromTemp * 9/5) + 32;
    } else if (toUnit === "k") {
      toTemp = fromTemp + 273.15;
    }
    
    return toTemp;
  } 
  
  if (conversionType === "currency" && exchangeRates?.[fromUnit] && exchangeRates?.[toUnit]) {
    return (value / exchangeRates[fromUnit]) * exchangeRates[toUnit];
  } 
  
  if (conversionType === "crypto" && cryptoRates?.[fromUnit] && cryptoRates?.[toUnit]) {
    return (value / cryptoRates[fromUnit]) * cryptoRates[toUnit];
  } 
  
  if ((conversionType === "currency" && cryptoRates?.[toUnit]) || 
      (conversionType === "crypto" && exchangeRates?.[toUnit])) {
    const cadValue = conversionType === "currency" 
      ? value / exchangeRates![fromUnit]
      : value / cryptoRates![fromUnit];
    
    return conversionType === "currency"
      ? cadValue * cryptoRates![toUnit]
      : cadValue * exchangeRates![toUnit];
  }

  const rates = conversionRates[conversionType as keyof typeof conversionRates];
  if (!rates) return 0;
  
  const fromRate = rates[fromUnit as keyof typeof rates] as number;
  const toRate = rates[toUnit as keyof typeof rates] as number;
  
  return (value / fromRate) * toRate;
}
