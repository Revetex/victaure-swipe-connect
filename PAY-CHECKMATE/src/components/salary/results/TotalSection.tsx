import { CreditCard, DollarSign, Receipt, Wallet } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface TotalSectionProps {
  netSalary: number;
  grossSalary: number;
  totalExpenses: number;
  isMobile: boolean;
}

export const TotalSection = ({ netSalary, grossSalary, totalExpenses, isMobile }: TotalSectionProps) => (
  <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-2 rounded-lg text-foreground shadow-lg border border-gray-300 dark:border-gray-600">
    <Table>
      <TableBody className="text-sm">
        <TableRow className="border-0 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
          <TableCell className="py-1 text-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Salaire brut
          </TableCell>
          <TableCell className="py-1 text-right text-foreground font-bold">
            ${grossSalary.toFixed(2)}
          </TableCell>
        </TableRow>
        <TableRow className="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
          <TableCell className="py-1 text-foreground flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Total des dépenses
          </TableCell>
          <TableCell className="py-1 text-right text-foreground font-bold">
            ${totalExpenses.toFixed(2)}
          </TableCell>
        </TableRow>
        <TableRow className="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
          <TableCell className="py-1 text-foreground flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Salaire net
          </TableCell>
          <TableCell className="py-1 text-right text-foreground font-bold">
            ${netSalary.toFixed(2)}
          </TableCell>
        </TableRow>
        <TableRow className="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
          <TableCell className="py-1 text-foreground flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Dépôt total
          </TableCell>
          <TableCell className="py-1 text-right text-foreground font-bold">
            ${(netSalary + totalExpenses).toFixed(2)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);