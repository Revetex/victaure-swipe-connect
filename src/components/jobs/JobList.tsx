import { Job } from "@/types/job";
import { JobCard } from "@/components/JobCard";
import { motion } from "framer-motion";

interface JobListProps {
  jobs: Job[];
  onJobDeleted?: () => void;
}

export function JobList({ jobs, onJobDeleted }: JobListProps) {
  return (
    <motion.div 
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {jobs.map((job) => (
        <JobCard key={job.id} {...job} />
      ))}
    </motion.div>
  );
}