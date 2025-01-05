import { Job } from "@/types/job";
import { JobCard } from "../JobCard";
import { Loader } from "../ui/loader";
import { motion } from "framer-motion";

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
}

export function JobList({ jobs, isLoading }: JobListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Aucune offre trouvée</p>
      </div>
    );
  }

  // Separate regular and scraped jobs
  const regularJobs = jobs.filter(job => !job.is_scraped);
  const scrapedJobs = jobs.filter(job => job.is_scraped);

  return (
    <div className="space-y-8">
      {regularJobs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Offres de la communauté</h2>
          <div className="grid grid-cols-1 gap-4">
            {regularJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <JobCard {...job} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {scrapedJobs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Offres externes</h2>
          <div className="grid grid-cols-1 gap-4">
            {scrapedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <JobCard {...job} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}