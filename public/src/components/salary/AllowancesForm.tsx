import React from 'react';
import { Allowances } from "@/types/salary";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { rates } from "@/constants/rates";
import { DollarSign, Plus, Trash2, Receipt, Truck, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface DayState {
  [key: string]: boolean;
}

interface ExpenseEntry {
  store: string;
  description: string;
  amount: number;
}

interface AllowancesFormProps {
  allowances: Allowances;
  onAllowanceChange: (type: keyof Allowances, value: number | DayState) => void;
  expenses: ExpenseEntry[];
  onExpensesChange: (expenses: ExpenseEntry[]) => void;
}

export const AllowancesForm = ({ allowances, onAllowanceChange, expenses, onExpensesChange }: AllowancesFormProps) => {
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

  const daysOfWeek = [
    { name: "D", value: "sunday" },
    { name: "L", value: "monday" },
    { name: "M", value: "tuesday" },
    { name: "M", value: "wednesday" },
    { name: "J", value: "thursday" },
    { name: "V", value: "friday" },
    { name: "S", value: "saturday" },
  ];

  const handleDayChange = (type: "pensionDaysApplied" | "mealDaysApplied" | "truckDaysApplied" | "overtimeMealDaysApplied", day: string, checked: boolean) => {
    const currentDays = (allowances[type] as DayState) || {};
    onAllowanceChange(type, {
      ...currentDays,
      [day]: checked
    });
  };

  const handleNumberInput = (type: keyof Allowances, value: string) => {
    onAllowanceChange(type, parseFloat(value) || 0);
  };

  const renderDayCheckboxes = (label: string, rate: number, icon: React.ReactNode, type: "pensionDaysApplied" | "mealDaysApplied" | "truckDaysApplied" | "overtimeMealDaysApplied") => (
    <div className="space-y-1 w-full max-w-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {React.cloneElement(icon as React.ReactElement, { className: 'h-3 w-3' })}
          <Label className="text-xs font-medium text-foreground">{label}</Label>
        </div>
        <span className="text-[10px] text-muted-foreground">${rate}/jour</span>
      </div>
      <div className="flex border divide-x rounded-md overflow-hidden border-border bg-background/50">
        {daysOfWeek.map((day) => (
          <div 
            key={day.value}
            className="flex-1 flex flex-col items-center"
          >
            <div className="w-full h-5 flex items-center justify-center bg-muted/20">
              <Label 
                htmlFor={`${label}-${day.value}`} 
                className="text-[9px] text-muted-foreground font-medium"
              >
                {day.name}
              </Label>
            </div>
            <div className="w-full h-6 flex items-center justify-center">
              <Checkbox
                id={`${label}-${day.value}`}
                className="h-4 w-4 rounded data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                checked={(allowances[type] as DayState)?.[day.value] || false}
                onCheckedChange={(checked) => handleDayChange(type, day.value, checked as boolean)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <DollarSign className="h-3.5 w-3.5 text-primary dark:text-white" />
        <h2 className="text-sm font-semibold text-foreground">Allocations</h2>
      </div>

      <div className="flex flex-col space-y-2 mb-3">
        {renderDayCheckboxes("Pension", rates.pension, <DollarSign className="h-3 w-3" />, "pensionDaysApplied")}
        {renderDayCheckboxes("Repas", rates.meal, <DollarSign className="h-3 w-3" />, "mealDaysApplied")}
        {renderDayCheckboxes("Repas temps double", rates.overtimeMeal, <UtensilsCrossed className="h-3 w-3" />, "overtimeMealDaysApplied")}
        {renderDayCheckboxes("Camion", rates.truck, <Truck className="h-3 w-3" />, "truckDaysApplied")}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="regularKm" className="text-[10px]">Kilométrage régulier</Label>
            <span className="text-[9px] text-muted-foreground">${rates.kmRegular}/km</span>
          </div>
          <Input
            id="regularKm"
            type="number"
            value={allowances.regularKm || ""}
            onChange={(e) => handleNumberInput("regularKm", e.target.value)}
            className="h-6 text-xs"
            placeholder="Nombre de km"
          />
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="loadedKm" className="text-[10px]">Kilométrage chargé</Label>
            <span className="text-[9px] text-muted-foreground">${rates.kmLoaded}/km</span>
          </div>
          <Input
            id="loadedKm"
            type="number"
            value={allowances.loadedKm || ""}
            onChange={(e) => handleNumberInput("loadedKm", e.target.value)}
            className="h-6 text-xs"
            placeholder="Nombre de km"
          />
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="trailerKm" className="text-[10px]">Kilométrage avec trailer</Label>
            <span className="text-[9px] text-muted-foreground">${rates.kmTrailer}/km</span>
          </div>
          <Input
            id="trailerKm"
            type="number"
            value={allowances.trailerKm || ""}
            onChange={(e) => handleNumberInput("trailerKm", e.target.value)}
            className="h-6 text-xs"
            placeholder="Nombre de km"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Receipt className="h-3.5 w-3.5" />
            <Label className="text-xs font-medium">Dépenses</Label>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={addExpenseEntry}
            className="h-5 w-5 hover:bg-blue-100 dark:hover:bg-blue-800"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-1">
          {expenses.map((expense, index) => (
            <div key={index} className="flex gap-1 items-start">
              {!isMobile && (
                <Input
                  value={expense.store}
                  onChange={(e) => handleExpenseChange(index, "store", e.target.value)}
                  className="h-6 text-xs"
                  placeholder="Magasin"
                />
              )}
              <Input
                value={expense.description}
                onChange={(e) => handleExpenseChange(index, "description", e.target.value)}
                className="h-6 text-xs"
                placeholder={isMobile ? "Magasin - Description" : "Description"}
              />
              <Input
                type="number"
                value={expense.amount || ""}
                onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
                className="h-6 text-xs"
                placeholder="0.00"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeExpenseEntry(index)}
                className="h-6 w-6 hover:bg-red-100 dark:hover:bg-red-900"
                disabled={expenses.length === 1}
              >
                <Trash2 className="h-3 w-3 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};