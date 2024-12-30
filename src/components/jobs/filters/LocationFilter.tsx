import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { quebecCities } from "@/data/cities";
import { JobFilters } from "../JobFilterUtils";

interface LocationFilterProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  openLocation: boolean;
  setOpenLocation: (open: boolean) => void;
}

export function LocationFilter({ filters, onFilterChange }: LocationFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Localisation
      </label>
      <Select
        value={filters.location || "all"}
        onValueChange={(value) => onFilterChange("location", value === "all" ? "" : value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner une ville..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les villes</SelectItem>
          {quebecCities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}