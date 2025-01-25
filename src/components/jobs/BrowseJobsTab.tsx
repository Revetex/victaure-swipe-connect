import { JobFilters } from "./JobFilterUtils";
import { JobFiltersPanel } from "./JobFiltersPanel";
import { SwipeMatch } from "../SwipeMatch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState("victaure");

  useEffect(() => {
    // Cleanup any existing elements
    const existingScript = document.getElementById('google-search-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Create and load the Google Custom Search script
    const script = document.createElement('script');
    script.id = 'google-search-script';
    script.src = "https://cse.google.com/cse.js?cx=85fd4a0d6d6a44d0a";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.getElementById('google-search-script');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="h-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          <div className="lg:col-span-1">
            <JobFiltersPanel 
              filters={filters}
              onFilterChange={onFilterChange}
              openLocation={openLocation}
              setOpenLocation={setOpenLocation}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
          </div>
          
          <div className="lg:col-span-3">
            <Tabs defaultValue="victaure" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="victaure">Offres Victaure</TabsTrigger>
                <TabsTrigger value="external">Recherche externe</TabsTrigger>
              </TabsList>

              <TabsContent value="victaure">
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
              </TabsContent>

              <TabsContent value="external">
                <div className="w-full min-h-[600px] bg-background rounded-lg p-4 border">
                  <div className="gcse-searchbox"></div>
                  <div className="gcse-searchresults"></div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}