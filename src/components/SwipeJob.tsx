import { useState, useEffect } from "react";
import { JobFilters, defaultFilters } from "./jobs/JobFilterUtils";
import { Search, Briefcase, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { JobCreationDialog } from "./jobs/JobCreationDialog";
import { BrowseJobsTab } from "./jobs/BrowseJobsTab";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const [isGoogleLoading, setIsGoogleLoading] = useState(true);
  const [hasGoogleError, setHasGoogleError] = useState(false);

  const { data: jobs = [], isLoading: isJobsLoading } = useQuery({
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
        .eq("status", "open")
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
        toast.error("Erreur lors du chargement des offres");
        throw error;
      }

      return data || [];
    },
  });

  const initializeGoogleSearch = () => {
    try {
      // Cleanup existing elements
      const existingElements = document.querySelectorAll(".gcse-search, .gcse-searchbox, .gcse-searchresults");
      existingElements.forEach(el => el.remove());
      
      const existingScripts = document.querySelectorAll("script[src*='cse.google.com']");
      existingScripts.forEach(script => script.remove());

      // Add Google Custom Search script
      const script = document.createElement("script");
      script.src = "https://cse.google.com/cse.js?cx=85fd4a0d6d6a44d0a";
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        console.log("Google Search script loaded successfully");
        setIsGoogleLoading(false);
        setHasGoogleError(false);
        
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

    } catch (error) {
      console.error("Error initializing Google Search:", error);
      setIsGoogleLoading(false);
      setHasGoogleError(true);
      toast.error("Erreur lors de l'initialisation de la recherche");
    }
  };

  useEffect(() => {
    initializeGoogleSearch();
    return () => {
      const existingElements = document.querySelectorAll(".gcse-search, .gcse-searchbox, .gcse-searchresults");
      existingElements.forEach(el => el.remove());
      
      const existingScripts = document.querySelectorAll("script[src*='cse.google.com']");
      existingScripts.forEach(script => script.remove());
    };
  }, []);

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleRetry = () => {
    setIsGoogleLoading(true);
    setHasGoogleError(false);
    initializeGoogleSearch();
  };

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
          onSuccess={() => {}}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-6 space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BrowseJobsTab 
                filters={filters}
                onFilterChange={handleFilterChange}
                openLocation={openLocation}
                setOpenLocation={setOpenLocation}
              />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {/* Victaure Jobs Section */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Offres Victaure</h3>
              {isJobsLoading ? (
                <div className="flex flex-col items-center justify-center gap-4 min-h-[200px]">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Chargement des offres Victaure...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 min-h-[200px]">
                  <Search className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucune offre Victaure disponible</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="p-4 rounded-lg border bg-card">
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">{job.company_name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* External Search Section */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Recherche externe</h3>
              {isGoogleLoading ? (
                <div className="flex flex-col items-center justify-center gap-4 min-h-[200px]">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Chargement de la recherche externe...</p>
                </div>
              ) : hasGoogleError ? (
                <div className="flex flex-col items-center justify-center gap-4 min-h-[200px]">
                  <Search className="h-12 w-12 text-destructive" />
                  <p className="text-muted-foreground">Une erreur est survenue lors du chargement de la recherche</p>
                  <Button onClick={handleRetry} variant="outline">
                    Réessayer
                  </Button>
                </div>
              ) : (
                <div className="google-search-container min-h-[400px]">
                  {/* Google Custom Search elements will be injected here */}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}