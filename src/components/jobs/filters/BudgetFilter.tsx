
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { type JobFilters } from "../JobFilterUtils";

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
            value={filters.salaryMin || ""}
            onChange={(e) => onFilterChange("salaryMin", e.target.value ? Number(e.target.value) : null)}
            placeholder="Min"
            min={0}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Maximum</Label>
          <Input
            type="number"
            value={filters.salaryMax || ""}
            onChange={(e) => onFilterChange("salaryMax", e.target.value ? Number(e.target.value) : null)}
            placeholder="Max"
            min={0}
          />
        </div>
      </div>
    </div>
  );
}
