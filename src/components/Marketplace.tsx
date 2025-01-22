import { useState } from "react";
import { JobList } from "./jobs/JobList";
import { JobFilters } from "./jobs/JobFilters";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { defaultFilters } from "@/types/filters";
import { motion } from "framer-motion";
import { Job } from "@/types/job";

export function Marketplace() {
  const [filters, setFilters] = useState(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      let query = supabase.from("jobs").select("*");

      // Apply filters
      if (filters.category !== "all") {
        query = query.eq("category", filters.category);
      }
      if (filters.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters.minBudget) {
        query = query.gte("budget", filters.minBudget);
      }
      if (filters.maxBudget) {
        query = query.lte("budget", filters.maxBudget);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Ensure the status is of the correct type
      return (data as any[]).map(job => ({
        ...job,
        status: job.status as "open" | "closed" | "in-progress"
      })) as Job[];
    },
  });

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="container mx-auto px-4 py-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">
            Trouvez votre prochaine mission
          </h1>
          
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-lg">
                <JobFilters 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                />
              </SheetContent>
            </Sheet>

            <Button variant="default">
              Créer une mission
            </Button>
          </div>
        </div>

        <div className="w-full">
          <JobList jobs={jobs || []} />
        </div>
      </div>
    </section>
  );
}