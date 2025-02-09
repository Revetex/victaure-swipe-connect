
import { JobFilters } from "./JobFilterUtils";
import { JobFiltersPanel } from "./JobFiltersPanel";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MapPin, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface BrowseJobsTabProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function BrowseJobsTab({ 
  filters, 
  onFilterChange, 
}: BrowseJobsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col lg:flex-row gap-6 p-4"
    >
      <div className="w-full lg:w-80 flex-shrink-0">
        <JobFiltersPanel 
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4 rounded-lg border bg-background/60 backdrop-blur-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Découvrez nos opportunités
            </h2>
            <p className="text-muted-foreground text-sm">
              Trouvez le job qui correspond à vos attentes parmi nos offres sélectionnées
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une offre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/60"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {filters.location && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {filters.location}
              </Badge>
            )}
            {filters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {filters.category}
              </Badge>
            )}
          </div>

          <div className="h-[1px] bg-border/50 my-6" />

          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {/* Jobs will be rendered here */}
            </div>
          </AnimatePresence>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
