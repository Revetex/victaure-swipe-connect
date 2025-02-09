
import { JobFilters } from "./JobFilterUtils";
import { JobFiltersPanel } from "./JobFiltersPanel";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BrowseJobsTabProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function BrowseJobsTab({ 
  filters, 
  onFilterChange, 
}: BrowseJobsTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex gap-6 p-4"
    >
      <div className="w-80 flex-shrink-0">
        <JobFiltersPanel 
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </div>

      <ScrollArea className="flex-1 rounded-lg border bg-background/60 backdrop-blur-sm">
        <div className="p-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              Découvrez nos opportunités
            </h2>
            <p className="text-muted-foreground">
              Trouvez le job qui correspond à vos attentes parmi nos offres sélectionnées
            </p>
          </div>

          <div className="h-[1px] bg-border my-6" />

          {/* Liste des jobs */}
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
