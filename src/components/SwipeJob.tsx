import { useState } from "react";
import { JobFilters, defaultFilters } from "./jobs/JobFilterUtils";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { JobCreationDialog } from "./jobs/JobCreationDialog";
import { BrowseJobsTab } from "./jobs/BrowseJobsTab";

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    if (key === "category" && value !== filters.category) {
      setFilters(prev => ({ ...prev, [key]: value, subcategory: "all" }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="h-full w-full bg-background/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between flex-wrap gap-2 p-4 border-b">
        <motion.h2 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-bold text-foreground"
        >
          Offres disponibles
        </motion.h2>
        
        <JobCreationDialog 
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSuccess={() => {}}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4"
      >
        <BrowseJobsTab 
          filters={filters}
          onFilterChange={handleFilterChange}
          openLocation={openLocation}
          setOpenLocation={setOpenLocation}
        />
      </motion.div>
    </motion.div>
  );
}