import { Plus, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { SwipeMatch } from "./SwipeMatch";
import { CreateJobForm } from "./jobs/CreateJobForm";
import { JobFilters, defaultFilters } from "./jobs/JobFilterUtils";
import { JobFiltersPanel } from "./jobs/JobFiltersPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobList } from "./jobs/JobList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const { data: myJobs, refetch: refetchMyJobs, isLoading } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos annonces");
        return [];
      }
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching my jobs:', error);
        toast.error("Erreur lors du chargement de vos annonces");
        return [];
      }
      
      return data?.map(job => ({
        ...job,
        company: "Votre entreprise",
        salary: `${job.budget} CAD`,
        skills: job.required_skills || []
      })) as Job[];
    }
  });

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    if (key === "category" && value !== filters.category) {
      setFilters(prev => ({ ...prev, [key]: value, subcategory: "all" }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card p-4 space-y-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <motion.h2 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-bold text-victaure-blue"
        >
          Offres disponibles
        </motion.h2>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-victaure-blue hover:bg-victaure-blue/90 text-white" 
              size="sm"
              onClick={() => {
                const { data: { user } } = supabase.auth.getUser();
                if (!user) {
                  toast.error("Vous devez être connecté pour créer une mission");
                  return;
                }
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une mission
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-victaure-blue">
                Ajouter une mission
              </DialogTitle>
              <DialogDescription className="text-victaure-gray-dark">
                Créez une nouvelle mission en remplissant les informations ci-dessous.
                Les professionnels pourront la consulter et y postuler.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <CreateJobForm onSuccess={() => {
                setIsOpen(false);
                refetchMyJobs();
                toast.success("Mission créée avec succès");
              }} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Parcourir les offres
          </TabsTrigger>
          <TabsTrigger value="my-jobs" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Mes annonces
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4">
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
                      onFilterChange={handleFilterChange}
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
        </TabsContent>

        <TabsContent value="my-jobs">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Mes annonces publiées</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : myJobs && myJobs.length > 0 ? (
              <JobList 
                jobs={myJobs} 
                onJobDeleted={() => {
                  refetchMyJobs();
                  toast.success("Annonce supprimée avec succès");
                }} 
              />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Vous n'avez pas encore publié d'annonces.
              </p>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}