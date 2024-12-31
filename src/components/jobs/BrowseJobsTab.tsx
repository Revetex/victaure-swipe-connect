import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import { JobFilters, defaultFilters } from "./JobFilterUtils";
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
  const [showFilters, setShowFilters] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
          </span>
          <Plus className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-45' : ''}`} />
        </Button>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <JobFiltersPanel 
                filters={filters}
                onFilterChange={onFilterChange}
                openLocation={openLocation}
                setOpenLocation={setOpenLocation}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
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