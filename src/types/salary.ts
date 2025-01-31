export interface SalaryData {
  hoursWorked: number;
  hourlyRate: number;
  jobTitle: string;
  allowances: number;
  premiums: number;
  expenses: number;
}

export interface SalaryResults {
  grossSalary: number;
  netSalary: number;
  totalDeductions: number;
  breakdown: {
    allowances: number;
    premiums: number;
    expenses: number;
  };
}
