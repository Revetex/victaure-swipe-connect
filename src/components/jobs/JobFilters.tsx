
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { JobFilters as JobFiltersType, defaultFilters } from "./JobFilterUtils";
import { SearchFilter } from "./filters/SearchFilter";
import { CategoryFilters } from "./filters/CategoryFilters";
import { LocationFilter } from "./filters/LocationFilter";
import { ExperienceFilter } from "./filters/ExperienceFilter";
import { BudgetFilter } from "./filters/BudgetFilter";
import { DateFilters } from "./filters/DateFilters";
import { WorkTypeFilters } from "./filters/WorkTypeFilters";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface JobFiltersProps {
  filters: JobFiltersType;
  onFilterChange: (key: keyof JobFiltersType, value: any) => void;
}

export function JobFilters({
  filters,
  onFilterChange,
}: JobFiltersProps) {
  const isMobile = useIsMobile();

  const resetFilters = () => {
    Object.keys(defaultFilters).forEach((key) => {
      onFilterChange(key as keyof JobFiltersType, defaultFilters[key as keyof JobFiltersType]);
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Filtres</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={resetFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>

      <SearchFilter filters={filters} onFilterChange={onFilterChange} />
      <Separator />
      
      <CategoryFilters filters={filters} onFilterChange={onFilterChange} />
      <Separator />
      
      <LocationFilter filters={filters} onFilterChange={onFilterChange} />
      <Separator />
      
      <ExperienceFilter filters={filters} onFilterChange={onFilterChange} />
      <Separator />
      
      <BudgetFilter filters={filters} onFilterChange={onFilterChange} />
      <Separator />
      
      <DateFilters filters={filters} onFilterChange={onFilterChange} />
      <Separator />
      
      <WorkTypeFilters filters={filters} onFilterChange={onFilterChange} />
    </motion.div>
  );
}
