import { SalaryResult } from "@/types/salary";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet } from "lucide-react";

interface DeductionsTableProps {
  salary: SalaryResult;
}

export const DeductionsTable = ({ salary }: DeductionsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={2} className="text-sm font-semibold text-red-800 dark:text-red-200 border-b border-red-200 dark:border-red-900">
            <div className="flex items-center gap-2">
              <Wallet className="h-3 w-3" />
              Déductions
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-sm">
        {Object.entries({
          'RRQ/RPC (5.95%)': salary.deductions.rrq,
          'Assurance emploi (1.63%)': salary.deductions.ei,
          'RQAP (0.494%)': salary.deductions.rqap,
          'Impôt provincial': salary.deductions.provincialTax,
          'Impôt fédéral': salary.deductions.federalTax,
          'Avantages sociaux CCQ (4.21%)': salary.deductions.socialBenefits,
          'Prélèvement CCQ (0.44%)': salary.deductions.ccqLevy,
          'Contribution sectorielle CCQ': salary.deductions.sectoralContribution,
          'Cotisation syndicale': salary.deductions.unionDues,
          'Vacances CCQ (13%)': salary.deductions.vacationPayDeduction,
        }).map(([label, value]) => (
          <TableRow key={label}>
            <TableCell className="py-1">{label}</TableCell>
            <TableCell className="py-1 text-right text-red-700 dark:text-red-400">
              ${value.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="font-semibold bg-red-50/50 dark:bg-red-900/50">
          <TableCell className="py-1">Total des déductions</TableCell>
          <TableCell className="py-1 text-right text-red-800 dark:text-red-200">
            -${salary.deductions.total.toFixed(2)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};