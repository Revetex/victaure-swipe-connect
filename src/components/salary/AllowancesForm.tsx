import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Allowances } from "../../types/salary";

interface AllowancesFormProps {
  allowances: Allowances;
  onAllowanceChange: (type: keyof Allowances, value: number | { [key: string]: boolean }) => void;
  expenses: { store: string; description: string; amount: number }[];
  onExpensesChange: (expenses: { store: string; description: string; amount: number }[]) => void;
}

export function AllowancesForm({
  allowances,
  onAllowanceChange,
  expenses,
  onExpensesChange,
}: AllowancesFormProps) {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  const handleDayToggle = (type: keyof Pick<Allowances, "pensionDaysApplied" | "mealDaysApplied" | "truckDaysApplied" | "overtimeMealDaysApplied">, day: string) => {
    const currentDays = allowances[type];
    onAllowanceChange(type, {
      ...currentDays,
      [day]: !currentDays[day],
    });
  };

  const handleExpenseChange = (index: number, field: keyof typeof expenses[0], value: string) => {
    const newExpenses = [...expenses];
    if (field === "amount") {
      newExpenses[index][field] = parseFloat(value) || 0;
    } else {
      newExpenses[index][field] = value;
    }
    onExpensesChange(newExpenses);
  };

  const addExpense = () => {
    onExpensesChange([...expenses, { store: "", description: "", amount: 0 }]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Allowances</h2>

      <div className="space-y-4">
        {["pension", "meal", "truck", "overtimeMeal"].map((type) => (
          <div key={type} className="space-y-2">
            <Label className="capitalize">{type} Days</Label>
            <div className="flex flex-wrap gap-4">
              {days.map((day) => (
                <div key={`${type}-${day}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${type}-${day}`}
                    checked={allowances[`${type}DaysApplied`][day]}
                    onCheckedChange={() => handleDayToggle(`${type}DaysApplied` as keyof Allowances, day)}
                  />
                  <Label htmlFor={`${type}-${day}`} className="capitalize">
                    {day}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Kilometers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="regularKm">Regular KM</Label>
            <Input
              id="regularKm"
              type="number"
              min="0"
              value={allowances.regularKm}
              onChange={(e) => onAllowanceChange("regularKm", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="loadedKm">Loaded KM</Label>
            <Input
              id="loadedKm"
              type="number"
              min="0"
              value={allowances.loadedKm}
              onChange={(e) => onAllowanceChange("loadedKm", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="trailerKm">Trailer KM</Label>
            <Input
              id="trailerKm"
              type="number"
              min="0"
              value={allowances.trailerKm}
              onChange={(e) => onAllowanceChange("trailerKm", parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Expenses</h3>
        {expenses.map((expense, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`store-${index}`}>Store</Label>
              <Input
                id={`store-${index}`}
                value={expense.store}
                onChange={(e) => handleExpenseChange(index, "store", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Input
                id={`description-${index}`}
                value={expense.description}
                onChange={(e) => handleExpenseChange(index, "description", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`amount-${index}`}>Amount</Label>
              <Input
                id={`amount-${index}`}
                type="number"
                min="0"
                step="0.01"
                value={expense.amount}
                onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addExpense}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Add Expense
        </button>
      </div>
    </div>
  );
}