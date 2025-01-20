import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { JobFilters } from "./jobs/JobFilters";
import { JobList } from "./jobs/JobList";
import { Filter, Search } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { JobCreationDialog } from "./jobs/JobCreationDialog";
import { defaultFilters } from "@/types/filters";
import type { Job } from "@/types/job";
import type { JobFilters as JobFiltersType } from "./jobs/JobFilterUtils";

export function Marketplace() {
  const [showFilters, setShowFilters] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchLoaded, setIsSearchLoaded] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);

  // Optimized Google Custom Search integration
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cse.google.com/cse.js?cx=d14c30c2cca67452a";
    script.async = true;
    
    script.onload = () => {
      setIsSearchLoaded(true);
      // Personnalisation du style après chargement
      const searchStyles = document.createElement('style');
      searchStyles.textContent = `
        .gsc-control-cse {
          background-color: transparent !important;
          border: none !important;
        }
        .gsc-input-box {
          border-radius: 0.5rem !important;
          border: 1px solid var(--border) !important;
          background: var(--background) !important;
        }
        .gsc-search-button-v2 {
          border-radius: 0.5rem !important;
          padding: 8px 16px !important;
          margin-left: 8px !important;
        }
      `;
      document.head.appendChild(searchStyles);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      const styles = document.head.querySelector('style:last-child');
      if (styles) document.head.removeChild(styles);
    };
  }, []);

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('jobs').select('*');
      if (error) throw new Error(error.message);
      return data as Job[];
    }
  });

  const handleFilterChange = (key: keyof JobFiltersType, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast.error("Error fetching jobs");
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">
            Trouvez votre prochaine mission
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
            <JobCreationDialog 
              isOpen={isOpen} 
              setIsOpen={setIsOpen}
              onSuccess={() => {
                toast.success("Mission créée avec succès");
              }}
            />
          </div>
        </div>

        {/* Recherche Google améliorée */}
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 glass-card dark:bg-gray-800/50 p-6 rounded-lg"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Search className="h-5 w-5" />
                <span className="font-medium">Recherche avancée</span>
              </div>
              {!isSearchLoaded ? (
                <div className="h-[100px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="gcse-search"></div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {showFilters && <JobFilters filters={filters} onFilterChange={handleFilterChange} />}
        <JobList jobs={jobs || []} />
      </div>
    </section>
  );
}