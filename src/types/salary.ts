export interface DailyHours {
  [key: string]: number;
  sunday: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
}

export interface Hours {
  regular: DailyHours;
  doubleTime: DailyHours;
  travelTime: DailyHours;
}

export interface Allowances {
  pensionDaysApplied: { [key: string]: boolean };
  mealDaysApplied: { [key: string]: boolean };
  truckDaysApplied: { [key: string]: boolean };
  overtimeMealDaysApplied: { [key: string]: boolean };
  regularKm: number;
  loadedKm: number;
  trailerKm: number;
  expenses: number;
  pension: number;
  meal: number;
  truck: number;
  km: number;
  total: number;
}

export interface Premiums {
  refractory: boolean;
  superintendent: boolean;
  nightShift: boolean;
  flyingPlatform: boolean;
  airAssisted: boolean;
  heavyIndustrial: boolean;
}

export interface JobInfo {
  weekEnding: string;
  companyName: string;
  jobSiteAddress: string;
  jobNumber: string;
}

export interface SalaryResult {
  hours: Hours;
  baseSalary: number;
  travelTimePay: number;
  premiumTotal: number;
  subtotal: number;
  vacationPay: number;
  deductions: {
    rrq: number;
    ei: number;
    rqap: number;
    unionDues: number;
    provincialTax: number;
    federalTax: number;
    socialBenefits: number;
    ccqLevy: number;
    sectoralContribution: number;
    vacationPayDeduction: number;
    total: number;
  };
  allowances: Allowances;
  netPay: number;
  totalPayment: number;
}
