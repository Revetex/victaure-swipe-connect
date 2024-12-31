import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { SwipeMatch } from "./SwipeMatch";
import { CreateJobForm } from "./jobs/CreateJobForm";
import { JobFilters } from "./jobs/JobFilterUtils";
import { JobFiltersPanel } from "./jobs/JobFiltersPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobList } from "./jobs/JobList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { toast } from "sonner";

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    category: "all",
    subcategory: "all",
    duration: "all",
    experienceLevel: "all",
    location: "",
    province: "",
    searchTerm: ""
  });

  const { data: myJobs, refetch: refetchMyJobs, isLoading, error } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching my jobs:', error);
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

  const handleMatchSuccess = async (jobId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        return;
      }

      // Get employer_id from the job
      const { data: jobData } = await supabase
        .from('jobs')
        .select('employer_id')
        .eq('id', jobId)
        .single();

      if (!jobData) {
        toast.error("Cette offre n'existe plus");
        return;
      }

      // Create match
      const { error: matchError } = await supabase
        .from('matches')
        .insert({
          job_id: jobId,
          professional_id: user.id,
          employer_id: jobData.employer_id,
          status: 'pending',
          match_score: 0.8 // TODO: Implement real matching score
        });

      if (matchError) throw matchError;

      // Create notification for employer
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
  };

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Offres disponibles</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-victaure-blue hover:bg-victaure-blue/90 text-white" size="sm">
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
              }} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Parcourir les offres</TabsTrigger>
          <TabsTrigger value="my-jobs">Mes annonces</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse">
          <JobFiltersPanel 
            filters={filters}
            onFilterChange={handleFilterChange}
            openLocation={openLocation}
            setOpenLocation={setOpenLocation}
          />
          
          <div className="flex justify-center">
            <SwipeMatch 
              filters={filters} 
              onMatchSuccess={handleMatchSuccess}
            />
          </div>
        </TabsContent>

        <TabsContent value="my-jobs">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mes annonces publiées</h3>
            {myJobs && myJobs.length > 0 ? (
              <JobList 
                jobs={myJobs} 
                onJobDeleted={refetchMyJobs}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Vous n'avez pas encore publié d'annonces.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}