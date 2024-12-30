import { JobFilters } from "./JobFilterUtils";
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
  return (
    <div className="bg-card p-4 rounded-lg space-y-6">
      <FilterSection filters={filters} onFilterChange={onFilterChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CategoryFilters 
          filters={filters} 
          onFilterChange={onFilterChange} 
        />
        <LocationFilter 
          filters={filters} 
          onFilterChange={onFilterChange}
        />
        <ExperienceFilter 
          filters={filters} 
          onFilterChange={onFilterChange} 
        />
      </div>
    </div>
  );
}