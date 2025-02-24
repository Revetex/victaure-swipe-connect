
import { Job } from "@/types/job";
import { JobCard } from "../JobCard";

interface JobsResultsProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
  onResetFilters?: () => void;
}

export function JobsResults({ jobs, onJobSelect }: JobsResultsProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-400">Aucune offre d'emploi ne correspond à vos critères</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onClick={() => onJobSelect(job)} />
      ))}
    </div>
  );
}
