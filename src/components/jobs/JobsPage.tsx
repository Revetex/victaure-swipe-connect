
import { useState } from "react";
import { JobList } from "./JobList";
import { JobFilters } from "@/types/filters";
import { Job } from "@/types/job";
import { useJobsData } from "@/hooks/useJobsData";
import { useJobFilters } from "@/hooks/useJobFilters";

export function JobsPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>();
  const { data: jobs = [], isLoading } = useJobsData();
  const { filters, updateFilter } = useJobFilters();

  const handleJobSelect = (job: Job) => {
    setSelectedJobId(job.id);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <JobList 
        jobs={jobs} 
        onJobSelect={handleJobSelect}
        selectedJobId={selectedJobId}
      />
    </div>
  );
}
