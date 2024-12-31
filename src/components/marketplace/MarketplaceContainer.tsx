import { useState } from "react";
import { useJobsQuery } from "./hooks/useJobsQuery";
import { JobFilters } from "../jobs/JobFilters";
import { JobList } from "../jobs/JobList";
import { missionCategories } from "@/types/job";
import { JobFilters as JobFiltersType, defaultFilters } from "../jobs/JobFilterUtils";

export function MarketplaceContainer() {
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);

  const { 
    data: jobs = [], 
    isLoading, 
    refetch,
    error 
  } = useJobsQuery(filters);

  const handleFilterChange = (key: keyof JobFiltersType, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <section className="py-8 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          <JobFilters
            category={filters.category}
            setCategory={(value) => handleFilterChange("category", value)}
            subcategory={filters.subcategory}
            setSubcategory={(value) => handleFilterChange("subcategory", value)}
            duration={filters.duration}
            setDuration={(value) => handleFilterChange("duration", value)}
            missionCategories={missionCategories}
          />
          <JobList 
            jobs={jobs} 
            isLoading={isLoading}
            error={error}
            onJobDeleted={() => refetch()} 
          />
        </div>
      </div>
    </section>
  );
}