import { Button } from "@/components/ui/button";
import { SlidersHorizontal, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { JobFilters as JobFiltersType, defaultFilters } from "./JobFilterUtils";
import { SearchFilter } from "./filters/SearchFilter";
import { CategoryFilters } from "./filters/CategoryFilters";
import { DistanceFilter } from "./filters/DistanceFilter";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      className={`lg:col-span-1 bg-card rounded-lg shadow-sm border ${
        isMobile ? "sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm" : ""
      }`}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
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
      </div>

      <ScrollArea className="h-[calc(100vh-200px)] lg:h-auto">
        <motion.div 
          className="p-4 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4">
            <SearchFilter filters={filters} onFilterChange={onFilterChange} />
            <Separator />
            <CategoryFilters filters={filters} onFilterChange={onFilterChange} />
            <Separator />
            <DistanceFilter filters={filters} onFilterChange={onFilterChange} />
          </div>
        </motion.div>
      </ScrollArea>
    </motion.div>
  );
}