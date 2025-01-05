import { Slider } from "@/components/ui/slider";
import { JobFilters } from "../JobFilterUtils";

interface BudgetFilterProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function BudgetFilter({ filters, onFilterChange }: BudgetFilterProps) {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Budget</label>
      <Slider
        min={0}
        max={200000}
        step={1000}
        value={[filters.minBudget, filters.maxBudget]}
        onValueChange={([min, max]) => {
          onFilterChange("minBudget", min);
          onFilterChange("maxBudget", max);
        }}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{filters.minBudget}$</span>
        <span>{filters.maxBudget}$</span>
      </div>
    </div>
  );
}