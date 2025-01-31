import React from "react";
import { calculateSalary } from "@/utils/salaryCalculator";
import { SalaryData } from "@/types/salary";

interface SalaryResultsProps {
  formData: {
    hours: any;
    jobInfo: any;
    allowances: any;
    premiums: any;
    expenses: any;
  };
}

export function SalaryResults({ formData }: SalaryResultsProps) {
  const { hours, jobInfo, allowances, premiums, expenses } = formData;

  const salaryDetails: SalaryData = calculateSalary({
    hours,
    jobInfo,
    allowances,
    premiums,
    expenses,
  });

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">Résultats</h2>
      <div className="mt-4">
        <p>
          <strong>Salaire Brut:</strong> {salaryDetails.grossSalary} €
        </p>
        <p>
          <strong>Salaire Net:</strong> {salaryDetails.netSalary} €
        </p>
        <p>
          <strong>Impôts:</strong> {salaryDetails.taxes} €
        </p>
        <p>
          <strong>Indemnités:</strong> {salaryDetails.allowances} €
        </p>
        <p>
          <strong>Primes:</strong> {salaryDetails.premiums} €
        </p>
        <p>
          <strong>Dépenses:</strong> {salaryDetails.expenses} €
        </p>
      </div>
    </div>
  );
}
