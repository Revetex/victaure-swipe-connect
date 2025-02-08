
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { JobCard } from "./JobCard";
import { useJobsData } from "@/hooks/useJobsData";
import type { ScrapedJobsListProps } from "@/types/jobs/types";

export function ScrapedJobsList({ queryString = "" }: ScrapedJobsListProps) {
  const navigate = useNavigate();
  const { data: jobs = [], isLoading } = useJobsData(queryString);

  const handleCreateJob = () => {
    navigate('/jobs/create');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-6"
      >
        <div className="flex justify-between items-center p-4 bg-card rounded-lg">
          <h2 className="text-2xl font-semibold">
            Offres d'emploi ({jobs.length})
          </h2>
          
          <Button
            onClick={handleCreateJob}
            className="bg-primary hover:bg-primary/90"
          >
            Publier une offre
          </Button>
        </div>
        
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune offre disponible
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
