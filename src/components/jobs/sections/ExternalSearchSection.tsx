
import { Job } from "@/types/job";
import { JobList } from "../JobList";
import { JobFilters } from "../JobFilterUtils";

interface ExternalSearchSectionProps {
  jobs: Job[];
  filters: JobFilters;
  queryString?: string;
  onFilterChange?: (key: keyof JobFilters, value: any) => void;
}

export function ExternalSearchSection({ 
  jobs, 
  filters,
  queryString,
  onFilterChange 
}: ExternalSearchSectionProps) {
  return (
    <JobList 
      filters={filters}
      showFilters={false}
      filterType="regular"
      jobs={jobs}
      viewMode="grid"
    />
  );
}
