import { Hours, Allowances, Premiums, SalaryResult, DailyHours } from "@/types/salary";
import { rates } from "@/constants/rates";
import { calculateTaxByBrackets, federalBrackets, provincialBrackets } from "./taxBrackets";

const calculateDailyTotal = (dailyHours: DailyHours): number => {
  return Object.values(dailyHours).reduce((acc: number, curr: number) => acc + (curr || 0), 0);
};

const countCheckedDays = (allowanceDay?: { [key: string]: boolean }): number => {
  if (!allowanceDay) return 0;
  return Object.values(allowanceDay).filter(Boolean).length;
};

export const calculateSalary = (
  hours: Hours,
  allowances: Allowances,
  premiums: Premiums
): SalaryResult => {
  // Calculate base salary
  const regularHours = calculateDailyTotal(hours.regular);
  const doubleTimeHours = calculateDailyTotal(hours.doubleTime);
  const travelTimeHours = calculateDailyTotal(hours.travelTime);

  const regularPay = regularHours * rates.regular;
  const doubleTimePay = doubleTimeHours * rates.doubleTime;
  const travelTimePay = travelTimeHours * rates.travelTime;
  
  const baseSalary = regularPay + doubleTimePay;

  // Calculate premiums
  const totalHours = regularHours + doubleTimeHours;
  let premiumTotal = 0;

  if (premiums.refractory) premiumTotal += totalHours * rates.premiums.refractory;
  if (premiums.superintendent) premiumTotal += baseSalary * rates.premiums.superintendent;
  if (premiums.nightShift) premiumTotal += totalHours * rates.premiums.nightShift;
  if (premiums.flyingPlatform) premiumTotal += totalHours * rates.premiums.flyingPlatform;
  if (premiums.airAssisted) premiumTotal += totalHours * rates.premiums.airAssisted;
  if (premiums.heavyIndustrial) premiumTotal += totalHours * rates.premiums.heavyIndustrial;

  const subtotal = baseSalary + premiumTotal + travelTimePay;
  const vacationPay = subtotal * rates.deductions.vacationRate;

  // Calculate allowances
  const pensionDays = countCheckedDays(allowances.pensionDaysApplied);
  const mealDays = countCheckedDays(allowances.mealDaysApplied);
  const truckDays = countCheckedDays(allowances.truckDaysApplied);
  const overtimeMealDays = countCheckedDays(allowances.overtimeMealDaysApplied);

  const pensionAllowance = pensionDays * rates.pension;
  const mealAllowance = mealDays * rates.meal;
  const truckAllowance = truckDays * rates.truck;
  const overtimeMealAllowance = overtimeMealDays * rates.overtimeMeal;
  
  const kmAllowance = 
    (allowances.regularKm || 0) * rates.kmRegular +
    (allowances.loadedKm || 0) * rates.kmLoaded +
    (allowances.trailerKm || 0) * rates.kmTrailer;

  const expensesAllowance = allowances.expenses || 0;

  const totalAllowances = 
    pensionAllowance +
    mealAllowance +
    truckAllowance +
    kmAllowance +
    expensesAllowance +
    overtimeMealAllowance;

  // Calculate deductions
  const rrqDeduction = subtotal * rates.deductions.rrqRate;
  const eiDeduction = subtotal * rates.deductions.eiRate;
  const rqapDeduction = subtotal * rates.deductions.rqapRate;
  const provincialTax = calculateTaxByBrackets(subtotal, provincialBrackets);
  const federalTax = calculateTaxByBrackets(subtotal, federalBrackets);
  const socialBenefits = subtotal * rates.deductions.socialBenefitsRate;
  const ccqLevy = subtotal * rates.deductions.ccqLevyRate;

  const totalDeductions = 
    rrqDeduction +
    eiDeduction +
    rqapDeduction +
    rates.deductions.unionDues +
    provincialTax +
    federalTax +
    socialBenefits +
    ccqLevy +
    rates.deductions.sectoralContribution +
    vacationPay;

  return {
    hours,
    baseSalary,
    travelTimePay,
    premiumTotal,
    subtotal,
    vacationPay,
    deductions: {
      rrq: rrqDeduction,
      ei: eiDeduction,
      rqap: rqapDeduction,
      unionDues: rates.deductions.unionDues,
      provincialTax,
      federalTax,
      socialBenefits,
      ccqLevy,
      sectoralContribution: rates.deductions.sectoralContribution,
      vacationPayDeduction: vacationPay,
      total: totalDeductions
    },
    allowances: {
      ...allowances,
      pension: pensionAllowance,
      meal: mealAllowance + overtimeMealAllowance,
      truck: truckAllowance,
      km: kmAllowance,
      expenses: expensesAllowance,
      total: totalAllowances
    },
    netPay: subtotal - totalDeductions,
    totalPayment: subtotal - totalDeductions + totalAllowances
  };
};