import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { JobFilters } from "../JobFilterUtils";

interface FilterSectionProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function FilterSection({ filters, onFilterChange }: FilterSectionProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une offre..."
          className="pl-8"
          value={filters.searchTerm}
          onChange={(e) => onFilterChange("searchTerm", e.target.value)}
        />
      </div>
    </div>
  );
}