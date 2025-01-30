import { JobFilters } from "./JobFilterUtils";
import { JobFiltersPanel } from "./JobFiltersPanel";
import { SwipeMatch } from "../SwipeMatch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BrowseJobsTabProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  openLocation: boolean;
  setOpenLocation: (open: boolean) => void;
}

export function BrowseJobsTab({ 
  filters, 
  onFilterChange, 
  openLocation, 
  setOpenLocation 
}: BrowseJobsTabProps) {
  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState("victaure");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="h-full"
      >
        <JobFiltersPanel 
          filters={filters}
          onFilterChange={onFilterChange}
          openLocation={openLocation}
          setOpenLocation={setOpenLocation}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      </motion.div>
    </AnimatePresence>
  );
}