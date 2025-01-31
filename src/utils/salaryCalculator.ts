import { HoursData } from "@/types/salary";
import { calculateTax } from "./taxBrackets";

export function calculateSalary(hours: HoursData) {
  const { hourlyRate, hoursWorked, overtimeHours } = hours;

  const regularPay = hourlyRate * hoursWorked;
  const overtimePay = hourlyRate * 1.5 * overtimeHours;
  const totalPay = regularPay + overtimePay;

  const tax = calculateTax(totalPay);
  const netPay = totalPay - tax;

  return {
    totalPay,
    tax,
    netPay,
  };
}
