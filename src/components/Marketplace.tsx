import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { JobFilters } from "./jobs/JobFilters";
import { JobList } from "./jobs/JobList";
import { Filter } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { JobCreationDialog } from "./jobs/JobCreationDialog";
import { defaultFilters } from "@/types/filters";
import type { Job } from "@/types/job";
import type { JobFilters as JobFiltersType } from "./jobs/JobFilterUtils";

export function Marketplace() {
  const [showFilters, setShowFilters] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);

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
    <section className="container mx-auto px-4 py-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:col-span-1 sticky top-24 h-[calc(100vh-8rem)]"
            >
              <JobFilters filters={filters} onFilterChange={handleFilterChange} />
            </motion.div>
          )}
          
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            <JobList jobs={jobs || []} />
          </div>
        </div>
      </div>
    </section>
  );
}