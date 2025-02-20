
import { useState } from "react";
import { JobList } from "./JobList";
import { useMyJobs } from "@/hooks/useMyJobs";
import { Job } from "@/types/job";

export function MyJobsTab() {
  const { jobs, fetchJobs } = useMyJobs();
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>();

  const handleJobSelect = (job: Job) => {
    setSelectedJobId(job.id);
  };

  return (
    <div className="space-y-4">
      <JobList 
        jobs={jobs} 
        onJobSelect={handleJobSelect}
        selectedJobId={selectedJobId}
      />
    </div>
  );
}
