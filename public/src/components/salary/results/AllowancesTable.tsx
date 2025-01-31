import { SalaryResult } from "@/types/salary";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign } from "lucide-react";

interface AllowancesTableProps {
  salary: SalaryResult;
}

export const AllowancesTable = ({ salary }: AllowancesTableProps) => {
  const showPension = salary.allowances.pension > 0;
  const showMeal = salary.allowances.meal > 0;
  const showTruck = salary.allowances.truck > 0;
  const showKm = salary.allowances.km > 0;
  const showExpenses = salary.allowances.expenses > 0;

  if (!showPension && !showMeal && !showTruck && !showKm && !showExpenses) {
    return null;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={2} className="text-sm font-semibold text-green-800 dark:text-green-200 border-b border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2">
              <DollarSign className="h-3 w-3" />
              Allocations
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-sm">
        {showPension && (
          <TableRow>
            <TableCell className="py-1">Pension</TableCell>
            <TableCell className="py-1 text-right text-green-700 dark:text-green-400">
              ${salary.allowances.pension.toFixed(2)}
            </TableCell>
          </TableRow>
        )}
        {showMeal && (
          <TableRow>
            <TableCell className="py-1">Repas</TableCell>
            <TableCell className="py-1 text-right text-green-700 dark:text-green-400">
              ${salary.allowances.meal.toFixed(2)}
            </TableCell>
          </TableRow>
        )}
        {showTruck && (
          <TableRow>
            <TableCell className="py-1">Camion</TableCell>
            <TableCell className="py-1 text-right text-green-700 dark:text-green-400">
              ${salary.allowances.truck.toFixed(2)}
            </TableCell>
          </TableRow>
        )}
        {showKm && (
          <TableRow>
            <TableCell className="py-1">Kilométrage</TableCell>
            <TableCell className="py-1 text-right text-green-700 dark:text-green-400">
              ${salary.allowances.km.toFixed(2)}
            </TableCell>
          </TableRow>
        )}
        {showExpenses && (
          <TableRow>
            <TableCell className="py-1">Dépenses</TableCell>
            <TableCell className="py-1 text-right text-green-700 dark:text-green-400">
              ${salary.allowances.expenses.toFixed(2)}
            </TableCell>
          </TableRow>
        )}
        {salary.allowances.total > 0 && (
          <TableRow className="font-semibold bg-green-50/50 dark:bg-green-900/50">
            <TableCell className="py-1">Total des allocations</TableCell>
            <TableCell className="py-1 text-right text-green-800 dark:text-green-200">
              ${salary.allowances.total.toFixed(2)}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};