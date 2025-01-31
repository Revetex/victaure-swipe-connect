import { Hours, Allowances, Premiums, SalaryResult } from "../types/salary";
import { rates } from "../constants/rates";

const calculateTotalHours = (hoursObj: { [key: string]: number }) => {
  return Object.values(hoursObj).reduce((acc, curr) => acc + curr, 0);
};

export const calculateSalary = (
  hours: Hours,
  allowances: Allowances,
  premiums: Premiums
): SalaryResult => {
  // Calculate total hours
  const regularHours = calculateTotalHours(hours.regular);
  const doubleTimeHours = calculateTotalHours(hours.doubleTime);
  const travelTimeHours = calculateTotalHours(hours.travelTime);

  // Calculate base pay rates with premiums
  let baseRate = rates.regular;
  if (premiums.refractory) baseRate += rates.premiums.refractory;
  if (premiums.superintendent) baseRate *= (1 + rates.premiums.superintendent);
  if (premiums.nightShift) baseRate += rates.premiums.nightShift;
  if (premiums.flyingPlatform) baseRate += rates.premiums.flyingPlatform;
  if (premiums.airAssisted) baseRate += rates.premiums.airAssisted;
  if (premiums.heavyIndustrial) baseRate += rates.premiums.heavyIndustrial;

  // Calculate pay
  const regularPay = regularHours * baseRate;
  const doubleTimePay = doubleTimeHours * (baseRate * 2);
  const travelTimePay = travelTimeHours * rates.travelTime;

  // Calculate gross pay
  const grossPay = regularPay + doubleTimePay + travelTimePay + allowances.total;

  // Calculate deductions
  const deductions = {
    rrq: grossPay * rates.deductions.rrqRate,
    ei: grossPay * rates.deductions.eiRate,
    rqap: grossPay * rates.deductions.rqapRate,
    unionDues: rates.deductions.unionDues,
    vacation: grossPay * rates.deductions.vacationRate,
    socialBenefits: grossPay * rates.deductions.socialBenefitsRate,
    ccqLevy: grossPay * rates.deductions.ccqLevyRate,
    sectoralContribution: rates.deductions.sectoralContribution,
    ccqInsurance: rates.deductions.ccqInsuranceRate,
    total: 0
  };

  // Calculate total deductions
  deductions.total = Object.values(deductions).reduce((acc, curr) => acc + curr, 0);

  return {
    regularHours,
    doubleTimeHours,
    travelTimeHours,
    regularPay,
    doubleTimePay,
    travelTimePay,
    allowances: allowances.total,
    grossPay,
    deductions,
    netPay: grossPay - deductions.total
  };
};