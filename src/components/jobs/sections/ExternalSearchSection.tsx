
import { Job } from "@/types/job";
import { JobList } from "../JobList";
import { JobFilters } from "../JobFilterUtils";

interface ExternalSearchSectionProps {
  jobs: Job[];
  filters: JobFilters;
}

export function ExternalSearchSection({ jobs, filters }: ExternalSearchSectionProps) {
  return (
    <JobList 
      filters={filters}
      showFilters={false}
      filterType="regular"
      jobs={jobs}
    />
  );
}
