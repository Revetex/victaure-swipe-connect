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
}

export function BrowseJobsTab({ 
  filters, 
  onFilterChange, 
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
        />
      </motion.div>
    </AnimatePresence>
  );
}