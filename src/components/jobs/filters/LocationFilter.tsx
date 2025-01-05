import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cities } from "@/data/provinces";
import { JobFilters } from "../JobFilterUtils";
import { useState } from "react";

interface LocationFilterProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function LocationFilter({ filters, onFilterChange }: LocationFilterProps) {
  const [selectedProvince, setSelectedProvince] = useState<string>(filters.province || "all");
  const availableCities = selectedProvince !== "all" ? cities[selectedProvince] || [] : [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Province
        </label>
        <Select
          value={selectedProvince}
          onValueChange={(value) => {
            setSelectedProvince(value);
            onFilterChange("province", value);
            onFilterChange("location", "all"); // Reset city when province changes
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les provinces" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les provinces</SelectItem>
            {Object.keys(cities).map((province) => (
              <SelectItem key={province} value={province}>
                {province}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Ville
        </label>
        <Select
          value={filters.location}
          onValueChange={(value) => onFilterChange("location", value)}
          disabled={selectedProvince === "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les villes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {availableCities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}