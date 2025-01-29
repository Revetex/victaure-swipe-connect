import { useState, useEffect } from "react";
import { JobFilters, defaultFilters } from "./jobs/JobFilterUtils";
import { Search, Briefcase, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { JobCreationDialog } from "./jobs/JobCreationDialog";
import { BrowseJobsTab } from "./jobs/BrowseJobsTab";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { Button } from "./ui/button";

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const initializeGoogleSearch = () => {
    try {
      // Cleanup existing elements
      const cleanup = () => {
        const existingElements = document.querySelectorAll('.gcse-search, .gcse-searchbox, .gcse-searchresults');
        existingElements.forEach(el => el.remove());
        
        const existingScripts = document.querySelectorAll('script[src*="cse.google.com"]');
        existingScripts.forEach(script => script.remove());
      };

      cleanup();

      // Add Google Custom Search script
      const script = document.createElement('script');
      script.src = "https://cse.google.com/cse.js?cx=85fd4a0d6d6a44d0a";
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        console.log("Google Search script loaded successfully");
        setIsLoading(false);
        setHasError(false);
        
        const container = document.querySelector('.google-search-container');
        if (container) {
          container.innerHTML = '';
          
          const searchBox = document.createElement('div');
          searchBox.className = 'gcse-searchbox';
          container.appendChild(searchBox);
          
          const searchResults = document.createElement('div');
          searchResults.className = 'gcse-searchresults';
          container.appendChild(searchResults);
        }
      };

      script.onerror = () => {
        console.error("Failed to load Google Search script");
        setIsLoading(false);
        setHasError(true);
        toast.error("Erreur lors du chargement de la recherche Google");
      };

    } catch (error) {
      console.error('Error initializing Google Search:', error);
      setIsLoading(false);
      setHasError(true);
      toast.error("Erreur lors de l'initialisation de la recherche");
    }
  };

  useEffect(() => {
    initializeGoogleSearch();
    
    return () => {
      const existingElements = document.querySelectorAll('.gcse-search, .gcse-searchbox, .gcse-searchresults');
      existingElements.forEach(el => el.remove());
      
      const existingScripts = document.querySelectorAll('script[src*="cse.google.com"]');
      existingScripts.forEach(script => script.remove());
    };
  }, []);

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    if (key === "category" && value !== filters.category) {
      setFilters(prev => ({ ...prev, [key]: value, subcategory: "all" }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    initializeGoogleSearch();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between p-6 border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
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
        className="container mx-auto p-6 space-y-6 max-w-7xl"
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

          <div className="lg:col-span-3">
            <div className="glass-card p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-4 min-h-[400px]">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Chargement des offres...</p>
                </div>
              ) : hasError ? (
                <div className="flex flex-col items-center justify-center gap-4 min-h-[400px]">
                  <Search className="h-12 w-12 text-destructive" />
                  <p className="text-muted-foreground">Une erreur est survenue lors du chargement des offres</p>
                  <Button onClick={handleRetry} variant="outline">
                    Réessayer
                  </Button>
                </div>
              ) : (
                <div className="google-search-container min-h-[800px]">
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