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

  const { data: myJobs, isLoading: myJobsLoading, refetch: refetchMyJobs } = useQuery({
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

  const { data: allJobs, isLoading: allJobsLoading } = useQuery({
    queryKey: ['all-jobs', filters],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters.experienceLevel !== 'all') {
        query = query.eq('experience_level', filters.experienceLevel);
      }
      if (filters.location) {
        query = query.eq('location', filters.location);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching all jobs:', error);
        return [];
      }

      return data?.map(job => ({
        ...job,
        company: "Company Name",
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
        
        <TabsContent value="browse" className="mt-4">
          <JobFiltersPanel 
            filters={filters}
            onFilterChange={handleFilterChange}
            openLocation={openLocation}
            setOpenLocation={setOpenLocation}
          />
          
          <div className="flex justify-center mt-6">
            {allJobs && allJobs.length > 0 ? (
              <JobList jobs={allJobs} isLoading={allJobsLoading} />
            ) : (
              <SwipeMatch filters={filters} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-jobs">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mes annonces publiées</h3>
            <JobList 
              jobs={myJobs || []} 
              isLoading={myJobsLoading}
              onJobDeleted={refetchMyJobs} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}