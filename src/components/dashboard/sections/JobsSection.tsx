import { JobList } from "@/components/jobs/JobList";
import { JobFiltersPanel } from "@/components/jobs/JobFiltersPanel";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { JobFilters } from "@/components/jobs/JobFilterUtils";

interface JobsSectionProps {
  variants: any;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  openLocation: boolean;
  setOpenLocation: (open: boolean) => void;
  jobs: any[];
  isLoading: boolean;
  error: Error | null;
  onJobDeleted: () => void;
  onCreateClick: () => void;
}

export function JobsSection({ 
  variants,
  showFilters,
  setShowFilters,
  filters,
  onFilterChange,
  openLocation,
  setOpenLocation,
  jobs,
  isLoading,
  error,
  onJobDeleted,
  onCreateClick
}: JobsSectionProps) {
  return (
    <motion.div 
      variants={variants}
      className="col-span-1 md:col-span-2 xl:col-span-3 min-h-[650px] md:min-h-[750px]"
    >
      <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1 overflow-auto">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mes Missions</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
              <Button
                onClick={onCreateClick}
                className="flex-1 sm:flex-none bg-victaure-blue hover:bg-victaure-blue-dark"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Mission
              </Button>
            </div>
          </div>

          {showFilters && (
            <JobFiltersPanel
              filters={filters}
              onFilterChange={onFilterChange}
              openLocation={openLocation}
              setOpenLocation={setOpenLocation}
            />
          )}

          <JobList 
            jobs={jobs} 
            isLoading={isLoading}
            error={error}
            onJobDeleted={onJobDeleted}
          />
        </div>
      </div>
    </motion.div>
  );
}