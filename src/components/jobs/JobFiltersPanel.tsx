import { useTranslation } from "react-i18next";
import { JobFilters } from "./JobFilterUtils";
import { FilterHeader } from "./filters/FilterHeader";
import { SearchFilter } from "./filters/SearchFilter";
import { CategoryFilter } from "./filters/CategoryFilter";
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
  setOpenLocation,
}: JobFiltersPanelProps) {
  const { t } = useTranslation("jobs");

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6 space-y-6">
      <FilterHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SearchFilter
          value={filters.searchTerm}
          onChange={(value) => onFilterChange("searchTerm", value)}
        />

        <CategoryFilter
          category={filters.category}
          subcategory={filters.subcategory}
          onCategoryChange={(value) => onFilterChange("category", value)}
          onSubcategoryChange={(value) => onFilterChange("subcategory", value)}
        />

        <LocationFilter
          location={filters.location}
          openLocation={openLocation}
          setOpenLocation={setOpenLocation}
          onLocationChange={(value) => onFilterChange("location", value)}
        />

        <ExperienceFilter
          experienceLevel={filters.experienceLevel}
          onExperienceLevelChange={(value) => onFilterChange("experienceLevel", value)}
        />
      </div>
    </div>
  );
}