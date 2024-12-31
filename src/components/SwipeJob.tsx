import { useState } from "react";
import { JobFilters, defaultFilters } from "./jobs/JobFilterUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { JobCreationDialog } from "./jobs/JobCreationDialog";
import { BrowseJobsTab } from "./jobs/BrowseJobsTab";
import { MyJobsTab } from "./jobs/MyJobsTab";

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card p-4 space-y-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <motion.h2 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-bold text-victaure-blue"
        >
          Offres disponibles
        </motion.h2>
        
        <JobCreationDialog 
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSuccess={() => {}}
        />
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Parcourir les offres
          </TabsTrigger>
          <TabsTrigger value="my-jobs" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Mes annonces
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4">
          <BrowseJobsTab 
            filters={filters}
            onFilterChange={handleFilterChange}
            openLocation={openLocation}
            setOpenLocation={setOpenLocation}
          />
        </TabsContent>

        <TabsContent value="my-jobs">
          <MyJobsTab />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}