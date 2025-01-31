export const taxBrackets = [
  { min: 0, max: 9875, rate: 0.10 },
  { min: 9876, max: 40125, rate: 0.12 },
  { min: 40126, max: 85525, rate: 0.22 },
  { min: 85526, max: 163300, rate: 0.24 },
  { min: 163301, max: 207350, rate: 0.32 },
  { min: 207351, max: 518400, rate: 0.35 },
  { min: 518401, rate: 0.37 },
];

export function calculateTax(income: number): number {
  let tax = 0;

  for (const bracket of taxBrackets) {
    if (income > bracket.min) {
      const taxableIncome = Math.min(income, bracket.max) - bracket.min;
      tax += taxableIncome * bracket.rate;
    } else {
      break;
    }
  }

  return tax;
}
