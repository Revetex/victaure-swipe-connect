
import { Job } from "@/types/job";
import { JobList } from "./JobList";
import { JobFilters } from "./JobFilterUtils";

interface ScrapedJobsListProps {
  jobs: Job[];
  filters: JobFilters;
}

export function ScrapedJobsList({ jobs, filters }: ScrapedJobsListProps) {
  return (
    <JobList 
      filters={filters}
      showFilters={true}
      filterType="regular"
      jobs={jobs}
    />
  );
}
