
export interface ExchangeRates {
  [key: string]: number;
}

export interface Rate {
  from_currency: string;
  to_currency: string;
  rate: number;
  type: string;
  last_updated: string;
}

export type ConversionType = "currency" | "crypto" | "length" | "weight" | "temperature";
