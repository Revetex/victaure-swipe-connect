
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { ExternalSearchSection } from "./jobs/sections/ExternalSearchSection";
import { JobFilters } from "./jobs/JobFilterUtils";
import { defaultFilters } from "./jobs/JobFilterUtils";
import { useSwipeJobs } from "./jobs/swipe/useSwipeJobs";

export function Marketplace() {
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);
  const { jobs } = useSwipeJobs(filters);

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container relative py-20 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center space-y-4"
        >
          <h1 className="text-4xl font-bold tracking-tight">
            Trouvez votre prochain{" "}
            <span className="text-primary">emploi de rêve</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Des milliers d'opportunités professionnelles vous attendent. Utilisez nos outils intelligents pour trouver le poste parfait.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Rechercher un poste, une entreprise..."
                className="w-full"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
      </div>

      <section className="py-8">
        <ExternalSearchSection 
          queryString={filters.searchTerm || ""}
          filters={filters}
          onFilterChange={handleFilterChange}
          jobs={jobs}
        />
      </section>
    </div>
  );
}
