import { Hours, Allowances, Premiums, SalaryResult } from "@/types/salary";
import { rates } from "@/constants/rates";

export const calculateSalary = (
  hours: Hours,
  allowances: Allowances,
  premiums: Premiums
): SalaryResult => {
  // Calculate regular hours total
  const regularHoursTotal = Object.values(hours.regular).reduce((sum, hours) => sum + hours, 0);
  const doubleTimeHoursTotal = Object.values(hours.doubleTime).reduce((sum, hours) => sum + hours, 0);
  const travelTimeHoursTotal = Object.values(hours.travelTime).reduce((sum, hours) => sum + hours, 0);

  // Calculate base salary
  let subtotal = (regularHoursTotal * rates.regular) +
                 (doubleTimeHoursTotal * rates.doubleTime) +
                 (travelTimeHoursTotal * rates.travelTime);

  // Apply premiums
  if (premiums.refractory) subtotal += (regularHoursTotal + doubleTimeHoursTotal) * rates.premiums.refractory;
  if (premiums.superintendent) subtotal *= (1 + rates.premiums.superintendent);
  if (premiums.nightShift) subtotal += (regularHoursTotal + doubleTimeHoursTotal) * rates.premiums.nightShift;
  if (premiums.flyingPlatform) subtotal += (regularHoursTotal + doubleTimeHoursTotal) * rates.premiums.flyingPlatform;
  if (premiums.airAssisted) subtotal += (regularHoursTotal + doubleTimeHoursTotal) * rates.premiums.airAssisted;
  if (premiums.heavyIndustrial) subtotal += (regularHoursTotal + doubleTimeHoursTotal) * rates.premiums.heavyIndustrial;

  // Calculate allowances
  const pensionDays = Object.values(allowances.pensionDaysApplied).filter(Boolean).length;
  const mealDays = Object.values(allowances.mealDaysApplied).filter(Boolean).length;
  const overtimeMealDays = Object.values(allowances.overtimeMealDaysApplied).filter(Boolean).length;
  const truckDays = Object.values(allowances.truckDaysApplied).filter(Boolean).length;

  const allowancesTotal = {
    pension: pensionDays * rates.pension,
    meal: (mealDays * rates.meal) + (overtimeMealDays * rates.overtimeMeal),
    truck: truckDays * rates.truck,
    km: (allowances.regularKm * rates.kmRegular) +
        (allowances.loadedKm * rates.kmLoaded) +
        (allowances.trailerKm * rates.kmTrailer),
    total: 0
  };

  allowancesTotal.total = allowancesTotal.pension + allowancesTotal.meal + 
                         allowancesTotal.truck + allowancesTotal.km;

  // Calculate deductions
  const deductions = {
    rrq: subtotal * rates.deductions.rrqRate,
    ei: subtotal * rates.deductions.eiRate,
    rqap: subtotal * rates.deductions.rqapRate,
    vacation: subtotal * rates.deductions.vacationRate,
    socialBenefits: subtotal * rates.deductions.socialBenefitsRate,
    ccqLevy: subtotal * rates.deductions.ccqLevyRate,
    sectoralContribution: rates.deductions.sectoralContribution,
    unionDues: rates.deductions.unionDues,
    total: 0
  };

  deductions.total = deductions.rrq + deductions.ei + deductions.rqap +
                    deductions.vacation + deductions.socialBenefits +
                    deductions.ccqLevy + deductions.sectoralContribution +
                    deductions.unionDues;

  return {
    hours,
    allowances: { ...allowances, ...allowancesTotal },
    deductions,
    subtotal
  };
};