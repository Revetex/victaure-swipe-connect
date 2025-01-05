import { useState } from "react";
import { JobFilters, defaultFilters } from "./jobs/JobFilterUtils";
import { motion } from "framer-motion";
import { JobCreationDialog } from "./jobs/JobCreationDialog";
import { BrowseJobsTab } from "./jobs/BrowseJobsTab";
import { SwipeMatch } from "./SwipeMatch";

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    if (key === "category" && value !== filters.category) {
      setFilters(prev => ({ ...prev, [key]: value, subcategory: "all" }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="glass-card p-4 space-y-4 rounded-lg shadow-lg bg-background/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <motion.h2 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-bold text-foreground"
        >
          Offres disponibles
        </motion.h2>
        
        <JobCreationDialog 
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSuccess={() => {}}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <BrowseJobsTab 
          filters={filters}
          onFilterChange={handleFilterChange}
          openLocation={openLocation}
          setOpenLocation={setOpenLocation}
        />
        
        <SwipeMatch 
          filters={filters}
          onMatchSuccess={async (jobId) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              toast.error("Vous devez être connecté pour effectuer cette action");
              return;
            }

            const { data: jobData } = await supabase
              .from('jobs')
              .select('employer_id')
              .eq('id', jobId)
              .single();

            if (!jobData) {
              toast.error("Cette offre n'existe plus");
              return;
            }

            const { error: matchError } = await supabase
              .from('matches')
              .insert({
                job_id: jobId,
                professional_id: user.id,
                employer_id: jobData.employer_id,
                status: 'pending',
                match_score: 0.8
              });

            if (matchError) throw matchError;

            const { error: notifError } = await supabase
              .from('notifications')
              .insert({
                user_id: jobData.employer_id,
                title: "Nouveau match !",
                message: "Un professionnel a manifesté son intérêt pour votre offre",
              });

            if (notifError) throw notifError;

            toast.success("Match créé avec succès !");
          }}
        />
      </motion.div>
    </motion.div>
  );
}
