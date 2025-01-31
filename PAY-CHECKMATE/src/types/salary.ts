export interface Hours {
  regular: {
    sunday: number;
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
  };
  doubleTime: {
    sunday: number;
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
  };
  travelTime: {
    sunday: number;
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
  };
}

export type DailyHours = {
  [key: string]: number;
};

export interface Premiums {
  refractory: boolean;
  superintendent: boolean;
  nightShift: boolean;
  flyingPlatform: boolean;
  airAssisted: boolean;
  heavyIndustrial: boolean;
}

export interface Allowances {
  pensionDaysApplied?: { [key: string]: boolean };
  mealDaysApplied?: { [key: string]: boolean };
  truckDaysApplied?: { [key: string]: boolean };
  overtimeMealDaysApplied?: { [key: string]: boolean };
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

export interface Deductions {
  rrq: number;
  ei: number;
  rqap: number;
  provincialTax: number;
  federalTax: number;
  socialBenefits: number;
  ccqLevy: number;
  sectoralContribution: number;
  unionDues: number;
  vacationPayDeduction: number;
  total: number;
}

export interface SalaryResult {
  baseSalary: number;
  premiumTotal: number;
  travelTimePay: number;
  subtotal: number;
  deductions: Deductions;
  allowances: Allowances;
  hours: Hours;
  netPay: number;
  totalPayment: number;
  vacationPay: number;
}

export interface JobInfo {
  weekEnding: string;
  companyName: string;
  jobSiteAddress: string;
  jobNumber?: string;
}