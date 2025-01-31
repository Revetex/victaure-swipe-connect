import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobFilters } from "../JobFilterUtils";
import { Search } from "lucide-react";

interface SearchFilterProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function SearchFilter({ filters, onFilterChange }: SearchFilterProps) {
  return (
    <div className="space-y-2">
      <Label>Rechercher</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={filters.searchTerm}
          onChange={(e) => onFilterChange("searchTerm", e.target.value)}
          placeholder="Rechercher une mission..."
          className="pl-10"
        />
      </div>
    </div>
  );
}