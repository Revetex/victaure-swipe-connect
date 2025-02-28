import { Job } from "@/types/job";
import { JobCard } from "../JobCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
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
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Effet pour simuler un chargement progressif des offres
  useEffect(() => {
    if (jobs.length === 0) return;
    setIsLoading(true);

    // Affiche progressivement les offres pour une meilleure expérience utilisateur
    const timeout = setTimeout(() => {
      setDisplayedJobs(jobs);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [jobs]);

  // Si aucune offre n'est disponible
  if (jobs.length === 0) {
    return;
  }

  // Affichage des offres avec animation
  return <div className="space-y-4">
      {isLoading ?
    // État de chargement
    <div className="grid gap-4">
          {Array.from({
        length: 3
      }).map((_, index) => <div key={index} className="h-[160px] rounded-lg bg-background/50 animate-pulse border border-border/30" />)}
        </div> :
    // Affichage des résultats avec animation
    <AnimatePresence>
          <motion.div className="grid gap-4" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3
      }}>
            {displayedJobs.map(job => <motion.div key={job.id} initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.2
        }}>
                <JobCard job={job} onClick={() => onJobSelect(job)} />
              </motion.div>)}
          </motion.div>
        </AnimatePresence>}
    </div>;
}