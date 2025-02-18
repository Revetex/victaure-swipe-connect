import { useEffect } from "react";
import { JobList } from "./JobList";
import { Job } from "@/types/job";
import { useMyJobs } from "@/hooks/useMyJobs";

interface JobListProps {
  filters: any;
  showFilters: boolean;
  filterType: string;
  viewMode: 'list' | 'grid' | 'cards';
  jobs?: Job[];
  onJobDeleted?: () => void;
}

export function MyJobsTab() {
  const { jobs, fetchJobs } = useMyJobs();

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <JobList 
      jobs={jobs} 
      filters={{}} 
      showFilters={false}
      filterType="regular"
      onJobDeleted={fetchJobs} 
      viewMode="grid"
    />
  );
}
