import { useState } from "react";
import { JobFilters } from "./jobs/JobFilters";
import { JobList } from "./jobs/JobList";
import { ScrapedJobsList } from "./jobs/ScrapedJobsList";
import { Job } from "@/types/job";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobFilters as JobFiltersType, defaultFilters, applyFilters } from "./jobs/JobFilterUtils";
import { Button } from "./ui/button";
import { Filter, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCreationDialog } from "./jobs/JobCreationDialog";

export function Marketplace() {
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: jobs = [], isLoading, refetch } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      console.log("Fetching jobs with filters:", filters);
      let query = supabase
        .from("jobs")
        .select(`
          *,
          employer:profiles(
            full_name,
            company_name,
            avatar_url
          )
        `)
        .eq('status', 'open')
        .order("created_at", { ascending: false });

      const filteredQuery = await applyFilters(query, filters);
      console.log("Filtered query:", filteredQuery);

      const { data, error } = await filteredQuery;

      if (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Erreur lors du chargement des offres");
        throw error;
      }

      if (!data || data.length === 0) {
        console.log("No jobs found");
        return [];
      }

      console.log("Fetched jobs:", data);
      return data.map(job => ({
        ...job,
        company: job.employer?.company_name || job.company_name || "Entreprise",
        employer_name: job.employer?.full_name || "Employeur",
        employer_avatar: job.employer?.avatar_url,
        skills: job.required_skills || [],
        salary: job.budget ? `${job.budget} ${job.salary_currency || 'CAD'}` : 'À discuter'
      })) as Job[];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 2
  });

  const handleFilterChange = (key: keyof JobFiltersType, value: any) => {
    setFilters(prev => {
      if (key === "category" && value !== prev.category) {
        return { ...prev, [key]: value, subcategory: "all" };
      }
      if (key === "missionType" && value !== prev.missionType) {
        return { ...prev, [key]: value, category: "all", subcategory: "all" };
      }
      return { ...prev, [key]: value };
    });
  };

  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-[2000px]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Offres d'emploi</h1>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-victaure-blue text-white hover:bg-victaure-blue/90"
          >
            Publier une offre
          </Button>
        </div>

        <JobCreationDialog 
          isOpen={isDialogOpen} 
          setIsOpen={setIsDialogOpen}
          onSuccess={() => {
            refetch();
            toast.success("Offre créée avec succès");
          }}
        />

        <Tabs defaultValue="internal" className="space-y-4">
          <TabsList className="w-full flex justify-center mb-4">
            <TabsTrigger value="internal">Offres Victaure</TabsTrigger>
            <TabsTrigger value="external" className="relative">
              Offres Externes
              <span className="absolute -right-2 -top-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="internal">
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {showFilters ? (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-1">
                    <JobFilters
                      filters={filters}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                  <div className="lg:col-span-4">
                    <JobList jobs={jobs} isLoading={isLoading} />
                  </div>
                </div>
              ) : (
                <JobList jobs={jobs} isLoading={isLoading} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="external">
            <ScrapedJobsList />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}