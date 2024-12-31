import { Input } from "@/components/ui/input";
import { JobFilters } from "@/types/filters";

interface BudgetFilterProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function BudgetFilter({ filters, onFilterChange }: BudgetFilterProps) {
  const handleMinBudgetChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    onFilterChange("minBudget", numValue);
  };

  const handleMaxBudgetChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    onFilterChange("maxBudget", numValue);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-foreground">Budget (CAD/jour)</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Minimum</label>
          <Input
            type="number"
            min="0"
            value={filters.minBudget}
            onChange={(e) => handleMinBudgetChange(e.target.value)}
            placeholder="Min"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Maximum</label>
          <Input
            type="number"
            min="0"
            value={filters.maxBudget}
            onChange={(e) => handleMaxBudgetChange(e.target.value)}
            placeholder="Max"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}