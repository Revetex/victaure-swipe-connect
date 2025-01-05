import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { JobFilters } from "../JobFilterUtils";

interface BudgetFilterProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function BudgetFilter({ filters, onFilterChange }: BudgetFilterProps) {
  return (
    <div className="space-y-4">
      <Label>Budget (CAD)</Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Minimum</Label>
          <Input
            type="number"
            value={filters.minBudget || ""}
            onChange={(e) => onFilterChange("minBudget", Number(e.target.value))}
            placeholder="Min"
            min={0}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Maximum</Label>
          <Input
            type="number"
            value={filters.maxBudget || ""}
            onChange={(e) => onFilterChange("maxBudget", Number(e.target.value))}
            placeholder="Max"
            min={0}
          />
        </div>
      </div>
    </div>
  );
}