
import { useState } from "react";
import { JobList } from "./JobList";
import { Job } from "@/types/job";

interface ScrapedJobsListProps {
  jobs: Job[];
}

export function ScrapedJobsList({ jobs }: ScrapedJobsListProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>();

  const handleJobSelect = (job: Job) => {
    setSelectedJobId(job.id);
  };

  return (
    <JobList 
      jobs={jobs}
      onJobSelect={handleJobSelect}
      selectedJobId={selectedJobId}
    />
  );
}
