import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExpenseEntry {
  store: string;
  description: string;
  amount: number;
}

interface ExpensesTableProps {
  expenses?: ExpenseEntry[];
}

export const ExpensesTable = ({ expenses = [] }: ExpensesTableProps) => {
  const isMobile = useIsMobile();
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (expenses.length === 0 || (expenses.length === 1 && !expenses[0].description && !expenses[0].store && !expenses[0].amount)) {
    return null;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={isMobile ? 2 : 3} className="text-sm font-semibold text-blue-800 dark:text-blue-200 border-b border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span>Dépenses détaillées</span>
            </div>
          </TableHead>
        </TableRow>
        <TableRow>
          {!isMobile && <TableHead className="w-1/4">Magasin</TableHead>}
          <TableHead className={isMobile ? "w-2/3" : "w-2/4"}>Description</TableHead>
          <TableHead className={isMobile ? "w-1/3" : "w-1/4"}>Montant</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense, index) => (
          expense.amount > 0 && (
            <TableRow key={index}>
              {!isMobile && (
                <TableCell>{expense.store}</TableCell>
              )}
              <TableCell>{isMobile ? `${expense.store} - ${expense.description}` : expense.description}</TableCell>
              <TableCell>${expense.amount.toFixed(2)}</TableCell>
            </TableRow>
          )
        ))}
        <TableRow className="font-semibold bg-blue-50/50 dark:bg-blue-900/50">
          <TableCell colSpan={isMobile ? 1 : 2} className="text-right">Total des dépenses:</TableCell>
          <TableCell>${totalExpenses.toFixed(2)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};