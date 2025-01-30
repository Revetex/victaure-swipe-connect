import { useState, useEffect } from "react";
import { JobFilters, defaultFilters } from "./jobs/JobFilterUtils";
import { Briefcase, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { JobCreationDialog } from "./jobs/JobCreationDialog";
import { BrowseJobsTab } from "./jobs/BrowseJobsTab";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VictaureJobsSection } from "./jobs/sections/VictaureJobsSection";
import { ExternalSearchSection } from "./jobs/sections/ExternalSearchSection";
import { Button } from "./ui/button";
import { Job } from "@/types/job";

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const [isGoogleLoading, setIsGoogleLoading] = useState(true);
  const [hasGoogleError, setHasGoogleError] = useState(false);

  const { data: jobs = [], isLoading: isJobsLoading, error: jobsError, refetch } = useQuery({
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
        .eq("status", "open" as const)
        .order("created_at", { ascending: false });

      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }
      if (filters.subcategory && filters.subcategory !== "all") {
        query = query.eq("subcategory", filters.subcategory);
      }
      if (filters.location && filters.location !== "") {
        query = query.eq("location", filters.location);
      }
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      }

      return (data || []).map(job => ({
        ...job,
        status: job.status as 'open' | 'closed' | 'in-progress'
      })) as Job[];
    },
  });

  const initializeGoogleSearch = () => {
    try {
      setIsGoogleLoading(true);
      setHasGoogleError(false);

      const existingElements = document.querySelectorAll(".gcse-search, .gcse-searchbox, .gcse-searchresults");
      existingElements.forEach(el => el.remove());
      
      const existingScripts = document.querySelectorAll("script[src*='cse.google.com']");
      existingScripts.forEach(script => script.remove());

      const script = document.createElement("script");
      script.src = "https://cse.google.com/cse.js?cx=85fd4a0d6d6a44d0a";
      script.async = true;
      
      script.onload = () => {
        setIsGoogleLoading(false);
        
        const container = document.querySelector(".google-search-container");
        if (container) {
          container.innerHTML = "";
          
          const searchBox = document.createElement("div");
          searchBox.className = "gcse-searchbox";
          container.appendChild(searchBox);
          
          const searchResults = document.createElement("div");
          searchResults.className = "gcse-searchresults";
          container.appendChild(searchResults);
        }
      };

      script.onerror = () => {
        console.error("Failed to load Google Search script");
        setIsGoogleLoading(false);
        setHasGoogleError(true);
        toast.error("Erreur lors du chargement de la recherche Google");
      };

      document.head.appendChild(script);

    } catch (error) {
      console.error("Error initializing Google Search:", error);
      setIsGoogleLoading(false);
      setHasGoogleError(true);
      toast.error("Erreur lors de l'initialisation de la recherche");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeGoogleSearch();
    }, 1000);

    return () => {
      clearTimeout(timer);
      const existingElements = document.querySelectorAll(".gcse-search, .gcse-searchbox, .gcse-searchresults");
      existingElements.forEach(el => el.remove());
      
      const existingScripts = document.querySelectorAll("script[src*='cse.google.com']");
      existingScripts.forEach(script => script.remove());
    };
  }, []);

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (jobsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
        <p className="text-muted-foreground mb-4">Une erreur est survenue lors du chargement des offres</p>
        <Button onClick={() => refetch()} variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-gradient-to-br from-background to-background/90 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between p-6 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-primary" />
          <motion.h2 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-2xl font-bold text-foreground"
          >
            Offres disponibles
          </motion.h2>
        </div>
        
        <JobCreationDialog 
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSuccess={() => refetch()}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-6 space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 lg:block">
            <div className="sticky top-24 bg-background rounded-lg border p-4 shadow-sm">
              <BrowseJobsTab 
                filters={filters}
                onFilterChange={handleFilterChange}
                openLocation={openLocation}
                setOpenLocation={setOpenLocation}
              />
            </div>
          </div>

          <div className="lg:col-span-9 space-y-6">
            <VictaureJobsSection 
              jobs={jobs}
              isLoading={isJobsLoading}
              onRetry={() => refetch()}
            />

            <ExternalSearchSection 
              isLoading={isGoogleLoading}
              hasError={hasGoogleError}
              onRetry={initializeGoogleSearch}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}