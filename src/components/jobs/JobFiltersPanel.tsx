import { useState } from "react";
import { JobFilters } from "./JobFilterUtils";
import { CategoryFilters } from "./filters/CategoryFilters";
import { LocationFilter } from "./filters/LocationFilter";
import { ExperienceFilter } from "./filters/ExperienceFilter";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JobFiltersPanelProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  openLocation: boolean;
  setOpenLocation: (open: boolean) => void;
}

export function JobFiltersPanel({ 
  filters, 
  onFilterChange, 
  openLocation, 
  setOpenLocation 
}: JobFiltersPanelProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-card rounded-lg shadow-sm border mb-6">      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex items-center justify-between p-4 text-muted-foreground hover:text-foreground"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filtres</span>
        </div>
        {showFilters ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ScrollArea className="h-[calc(100vh-300px)] sm:h-auto">
              <div className="p-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <CategoryFilters 
                    filters={filters} 
                    onFilterChange={onFilterChange} 
                  />
                  <LocationFilter 
                    filters={filters} 
                    onFilterChange={onFilterChange}
                  />
                  <ExperienceFilter 
                    filters={filters} 
                    onFilterChange={onFilterChange} 
                  />
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}