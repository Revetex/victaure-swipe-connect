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

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    category: "all",
    subcategory: "all",
    duration: "all",
    experienceLevel: "all",
    location: "",
    searchTerm: ""
  });

  const { data: myJobs, refetch: refetchMyJobs } = useQuery({
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
        skills: []
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
    <div className="space-y-4">
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
            <SwipeMatch filters={filters} />
          </div>
        </TabsContent>

        <TabsContent value="my-jobs">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mes annonces publiées</h3>
            {myJobs && myJobs.length > 0 ? (
              <JobList jobs={myJobs} onJobDeleted={refetchMyJobs} />
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