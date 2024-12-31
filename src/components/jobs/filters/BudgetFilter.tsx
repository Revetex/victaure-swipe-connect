import { Slider } from "@/components/ui/slider";
import { JobFilters } from "@/types/filters";

interface BudgetFilterProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function BudgetFilter({ filters, onFilterChange }: BudgetFilterProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-foreground">Budget (CAD/jour)</h4>
      <Slider
        defaultValue={[filters.minBudget, filters.maxBudget]}
        max={1000}
        min={300}
        step={50}
        onValueChange={(value) => {
          onFilterChange("minBudget", value[0]);
          onFilterChange("maxBudget", value[1]);
        }}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{filters.minBudget} CAD</span>
        <span>{filters.maxBudget} CAD</span>
      </div>
    </div>
  );
}