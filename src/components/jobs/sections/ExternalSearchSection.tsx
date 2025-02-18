
import { useState } from "react";
import { JobList } from "../JobList";
import { Job } from "@/types/job";

interface ExternalSearchSectionProps {
  jobs: Job[];
}

export function ExternalSearchSection({ jobs }: ExternalSearchSectionProps) {
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
