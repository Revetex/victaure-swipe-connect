import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";
import { JobActions } from "./JobActions";

interface JobListProps {
  jobs: Job[];
  onJobDeleted?: () => void;
}

export function JobList({ jobs, onJobDeleted }: JobListProps) {
  if (!jobs.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucune annonce disponible</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 lg:col-span-3">
      {jobs.map((job) => (
        <div key={job.id} className="relative">
          <JobCard {...job} />
          <JobActions 
            jobId={job.id} 
            employerId={job.employer_id}
            onDelete={onJobDeleted || (() => {})}
            onEdit={() => {}}
          />
        </div>
      ))}
    </div>
  );
}