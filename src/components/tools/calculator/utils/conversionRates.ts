
export const conversionRates = {
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
} as const;
