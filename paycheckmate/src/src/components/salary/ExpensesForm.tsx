import { Receipt, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExpenseEntry {
  store: string;
  description: string;
  amount: number;
}

interface ExpensesFormProps {
  expenses: ExpenseEntry[];
  onExpensesChange: (expenses: ExpenseEntry[]) => void;
}

export const ExpensesForm = ({ expenses, onExpensesChange }: ExpensesFormProps) => {
  const isMobile = useIsMobile();

  const handleExpenseChange = (index: number, field: keyof ExpenseEntry, value: string) => {
    const newExpenses = [...expenses];
    if (field === "amount") {
      newExpenses[index] = { ...newExpenses[index], [field]: parseFloat(value) || 0 };
    } else {
      newExpenses[index] = { ...newExpenses[index], [field]: value };
    }
    onExpensesChange(newExpenses);
  };

  const addExpenseEntry = () => {
    onExpensesChange([...expenses, { store: "", description: "", amount: 0 }]);
  };

  const removeExpenseEntry = (index: number) => {
    if (expenses.length > 1) {
      const newExpenses = expenses.filter((_, i) => i !== index);
      onExpensesChange(newExpenses);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gradient">
          <Receipt className="h-5 w-5" />
          <Label className="font-semibold">Dépenses</Label>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={addExpenseEntry}
          className="h-8 w-8 hover:bg-violet-100 dark:hover:bg-violet-900 hover:text-violet-600 dark:hover:text-violet-400 float"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {expenses.map((expense, index) => (
          <div key={index} className="flex gap-2 items-start group animate-fade-in">
            {!isMobile && (
              <Input
                value={expense.store}
                onChange={(e) => handleExpenseChange(index, "store", e.target.value)}
                className="h-8 group-hover:border-violet-200 dark:group-hover:border-violet-800"
                placeholder="Magasin"
              />
            )}
            <Input
              value={expense.description}
              onChange={(e) => handleExpenseChange(index, "description", e.target.value)}
              className="h-8 group-hover:border-violet-200 dark:group-hover:border-violet-800"
              placeholder={isMobile ? "Magasin - Description" : "Description"}
            />
            <Input
              type="number"
              value={expense.amount || ""}
              onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
              className="h-8 group-hover:border-violet-200 dark:group-hover:border-violet-800"
              placeholder="0.00"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeExpenseEntry(index)}
              className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900 group-hover:opacity-100 transition-opacity"
              disabled={expenses.length === 1}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};