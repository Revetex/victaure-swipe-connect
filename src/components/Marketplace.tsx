
import { motion } from "framer-motion";
import { Filter, Rocket, Search, Briefcase, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { ExternalSearchSection } from "./jobs/sections/ExternalSearchSection";
import { JobFilters } from "./jobs/JobFilterUtils";
import { defaultFilters } from "./jobs/JobFilterUtils";
import { useSwipeJobs } from "./jobs/swipe/useSwipeJobs";
import { cn } from "@/lib/utils";

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
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Rocket className="h-4 w-4" />
            <span className="text-sm font-medium">Une nouvelle façon de trouver un emploi</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Trouvez votre prochain emploi de rêve avec Victaure
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez des milliers d'opportunités professionnelles grâce à notre 
            technologie innovante de matching. Laissez-vous guider vers le poste parfait.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <Input
              placeholder="Rechercher un poste, une entreprise..."
              className="pl-10 pr-4 h-12 bg-background border-primary/20 focus:border-primary"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
            
            <Button 
              variant="outline" 
              className={cn(
                "absolute right-1 top 1 bottom-1",
                "bg-primary/5 border-primary/20 hover:bg-primary/10",
                "text-primary"
              )}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Button variant="outline" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Tous les emplois
          </Button>
          <Button variant="outline" className="gap-2">
            <Globe className="h-4 w-4" />
            À distance
          </Button>
        </motion.div>
      </div>

      <section className="py-8 bg-primary/5">
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
