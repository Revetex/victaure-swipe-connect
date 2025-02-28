
import { Job } from "@/types/job";
import { JobCard } from "../JobCard";
import { motion } from "framer-motion";

interface JobsResultsProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
  onResetFilters?: () => void;
}

export function JobsResults({
  jobs,
  onJobSelect,
  onResetFilters
}: JobsResultsProps) {
  if (jobs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="mb-4 p-6 rounded-full bg-white/5 text-[#64B5D9]">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">Aucun résultat</h3>
        <p className="text-white/70 mb-4">Aucun emploi ne correspond à vos critères de recherche.</p>
        {onResetFilters && (
          <button 
            onClick={onResetFilters}
            className="py-2 px-4 bg-[#64B5D9]/20 hover:bg-[#64B5D9]/30 rounded-md transition-colors text-[#64B5D9] text-sm"
          >
            Réinitialiser les filtres
          </button>
        )}
      </motion.div>
    );
  }
  
  return (
    <div className="grid gap-4">
      {jobs.map(job => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.01 }}
        >
          <JobCard job={job} onClick={() => onJobSelect(job)} />
        </motion.div>
      ))}
    </div>
  );
}
