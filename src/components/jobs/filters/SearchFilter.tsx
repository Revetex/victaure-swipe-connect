import { Input } from "@/components/ui/input";
import { JobFilters } from "@/types/filters";

interface SearchFilterProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function SearchFilter({ filters, onFilterChange }: SearchFilterProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-foreground">Recherche</h4>
      <Input
        placeholder="Rechercher une offre..."
        value={filters.searchTerm}
        onChange={(e) => onFilterChange("searchTerm", e.target.value)}
      />
    </div>
  );
}