import { Input } from "@/components/ui/input";
import { JobFilters } from "../JobFilterUtils";

interface SearchFilterProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function SearchFilter({ filters, onFilterChange }: SearchFilterProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Recherche</label>
      <Input
        placeholder="Rechercher une mission..."
        value={filters.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
      />
    </div>
  );
}