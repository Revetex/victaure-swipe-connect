
import { Job } from "@/types/job";
import { JobsList } from "../JobsList";
import { JobSearch } from "../JobSearch";

interface JobsResultsProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
  selectedJobId?: string;
  onResetFilters: () => void;
}

export function JobsResults({ 
  jobs,
  onJobSelect,
  selectedJobId,
  onResetFilters
}: JobsResultsProps) {
  return (
    <div className="space-y-4 p-4">
      <JobSearch />
      <JobsList 
        jobs={jobs}
        onJobSelect={onJobSelect}
        selectedJobId={selectedJobId}
      />
    </div>
  );
}
