import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { provinceData } from "@/data/provinces";
import { JobFilters } from "@/types/job";

interface LocationFilterProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function LocationFilter({ filters, onFilterChange }: LocationFilterProps) {
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const cities = selectedProvince !== "all" ? provinceData[selectedProvince] || [] : [];

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
            // Reset location when province changes
            onFilterChange("location", "");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les provinces" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les provinces</SelectItem>
            {Object.keys(provinceData).map((province) => (
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
            <SelectItem value="">Toutes les villes</SelectItem>
            {cities.map((city) => (
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