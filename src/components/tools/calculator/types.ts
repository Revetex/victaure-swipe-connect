
export interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export type ConversionType = 'currency' | 'crypto' | 'temperature' | 'length' | 'weight' | 'time' | 'unit';

export type TransactionType = 'fixed' | 'variable' | 'subscription';
