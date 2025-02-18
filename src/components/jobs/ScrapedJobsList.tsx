import { Job } from "@/types/job";
lov-code>
import { Job } from "@/types/job";
import { JobList } from "./JobList";
import { JobFilters } from "./JobFilterUtils";

interface JobListProps {
  filters: any;
  showFilters: boolean;
  filterType: string;
  viewMode: 'list' | 'grid' | 'cards';
  jobs?: Job[];
}

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
      viewMode="grid"
    />
  );
}
