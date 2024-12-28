import { JobCard } from "@/components/JobCard";
import { Job } from "@/types/job";
import { JobActions } from "./JobActions";

interface JobListProps {
  jobs: Job[];
  onJobDeleted?: () => void;
}

export function JobList({ jobs, onJobDeleted }: JobListProps) {
  return (
    <div className="grid gap-4 sm:gap-6">
      {jobs.map((job) => (
        <div key={job.id} className="relative">
          <JobCard {...job} />
          <div className="mt-4">
            <JobActions 
              jobId={job.id} 
              employerId={job.employer_id}
              onDelete={onJobDeleted || (() => {})}
              onEdit={() => {}}
            />
          </div>
        </div>
      ))}
    </div>
  );
}