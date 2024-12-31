import { JobFilters } from "./JobFilterUtils";
import { JobFiltersPanel } from "./JobFiltersPanel";
import { SwipeMatch } from "../SwipeMatch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface BrowseJobsTabProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  openLocation: boolean;
  setOpenLocation: (open: boolean) => void;
}

export function BrowseJobsTab({ 
  filters, 
  onFilterChange, 
  openLocation, 
  setOpenLocation 
}: BrowseJobsTabProps) {
  const [showFilters, setShowFilters] = useState(true);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <JobFiltersPanel 
          filters={filters}
          onFilterChange={onFilterChange}
          openLocation={openLocation}
          setOpenLocation={setOpenLocation}
        />
        
        <div className="flex justify-center mt-6">
          <SwipeMatch 
            filters={filters} 
            onMatchSuccess={async (jobId) => {
              try {
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
              } catch (error) {
                console.error('Error creating match:', error);
                toast.error("Une erreur est survenue lors du match");
              }
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}