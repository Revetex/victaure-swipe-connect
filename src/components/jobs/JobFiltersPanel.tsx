import { SlidersHorizontal, ChevronUp, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobFilters } from "./JobFilterUtils";
import { useState } from "react";
import { FilterSection } from "./filters/FilterSection";
import { CategoryFilters } from "./filters/CategoryFilters";
import { LocationFilter } from "./filters/LocationFilter";
import { ExperienceFilter } from "./filters/ExperienceFilter";

interface JobFiltersPanelProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  openLocation: boolean;
  setOpenLocation: (open: boolean) => void;
}

export function JobFiltersPanel({ 
  filters, 
  onFilterChange, 
  openLocation, 
  setOpenLocation 
}: JobFiltersPanelProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-card p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <FilterSection filters={filters} onFilterChange={onFilterChange} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="ml-2 text-muted-foreground hover:text-foreground"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtres
          {showFilters ? (
            <ChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
          <CategoryFilters 
            filters={filters} 
            onFilterChange={onFilterChange} 
          />
          <LocationFilter 
            filters={filters} 
            onFilterChange={onFilterChange}
            openLocation={openLocation}
            setOpenLocation={setOpenLocation}
          />
          <ExperienceFilter 
            filters={filters} 
            onFilterChange={onFilterChange} 
          />
        </div>
      )}
    </div>
  );
}