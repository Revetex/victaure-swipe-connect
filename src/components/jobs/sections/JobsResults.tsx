
import { Job } from "@/types/job";
import { JobCard } from "../JobCard";

interface JobsResultsProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
  onResetFilters?: () => void;
}

export function JobsResults({
  jobs,
  onJobSelect
}: JobsResultsProps) {
  if (jobs.length === 0) {
    return;
  }
  
  return <div className="grid gap-4">
      {jobs.map(job => <JobCard key={job.id} job={job} onClick={() => onJobSelect(job)} />)}
    </div>;
}
