
import { useEffect } from "react";
import { JobList } from "./JobList";
import { Job } from "@/types/job";
import { useMyJobs } from "@/hooks/useMyJobs";

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
    />
  );
}
