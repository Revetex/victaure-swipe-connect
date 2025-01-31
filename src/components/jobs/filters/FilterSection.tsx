import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { JobFilters } from "../JobFilterUtils";
import { memo, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

interface FilterSectionProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export const FilterSection = memo(function FilterSection({ 
  filters, 
  onFilterChange 
}: FilterSectionProps) {
  const debouncedFilterChange = useDebouncedCallback(
    (value: string) => {
      onFilterChange("searchTerm", value);
    },
    300
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedFilterChange(e.target.value);
  }, [debouncedFilterChange]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Rechercher une offre..."
          className="pl-8"
          defaultValue={filters.searchTerm}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
});