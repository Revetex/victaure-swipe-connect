import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { SearchFilter } from "./filters/SearchFilter";
import { CategoryFilters } from "./filters/CategoryFilters";
import { BudgetFilter } from "./filters/BudgetFilter";
import { JobFilters as JobFiltersType, defaultFilters } from "@/types/filters";

interface JobFiltersProps {
  filters: JobFiltersType;
  onFilterChange: (key: keyof JobFiltersType, value: any) => void;
}

export function JobFilters({
  filters,
  onFilterChange,
}: JobFiltersProps) {
  const resetFilters = () => {
    Object.keys(defaultFilters).forEach((key) => {
      onFilterChange(key as keyof JobFiltersType, defaultFilters[key as keyof JobFiltersType]);
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="sticky top-0 z-40 p-4 border-b border-border/50 bg-background">
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

      <ScrollArea className="flex-1 p-4">
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SearchFilter filters={filters} onFilterChange={onFilterChange} />
          <Separator className="my-6" />
          <CategoryFilters filters={filters} onFilterChange={onFilterChange} />
          <Separator className="my-6" />
          <BudgetFilter filters={filters} onFilterChange={onFilterChange} />
        </motion.div>
      </ScrollArea>
    </div>
  );
}