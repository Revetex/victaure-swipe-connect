// Paliers d'imposition fédéral 2024
export const federalBrackets = [
  { min: 0, max: 55867, rate: 0.15 },
  { min: 55867, max: 111733, rate: 0.205 },
  { min: 111733, max: 173205, rate: 0.26 },
  { min: 173205, max: 246752, rate: 0.29 },
  { min: 246752, max: Infinity, rate: 0.33 }
];

// Paliers d'imposition Québec 2024
export const provincialBrackets = [
  { min: 0, max: 49275, rate: 0.14 },
  { min: 49275, max: 98540, rate: 0.19 },
  { min: 98540, max: 119910, rate: 0.24 },
  { min: 119910, max: Infinity, rate: 0.26 }
];

export const calculateTaxByBrackets = (income: number, brackets: typeof federalBrackets) => {
  let remainingIncome = income;
  let totalTax = 0;

  for (const bracket of brackets) {
    const taxableInThisBracket = Math.min(
      Math.max(0, remainingIncome),
      bracket.max - bracket.min
    );
    
    totalTax += taxableInThisBracket * bracket.rate;
    remainingIncome -= taxableInThisBracket;

    if (remainingIncome <= 0) break;
  }

  return totalTax;
};