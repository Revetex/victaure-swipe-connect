import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { JobFilters as JobFiltersType, defaultFilters } from "./JobFilterUtils";
import { SearchFilter } from "./filters/SearchFilter";
import { CategoryFilters } from "./filters/CategoryFilters";
import { BudgetFilter } from "./filters/BudgetFilter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
    <div className={`lg:col-span-1 bg-card rounded-lg shadow-sm border ${
      isMobile ? "sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm" : ""
    }`}>
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
            Réinitialiser
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)] lg:h-auto">
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <SearchFilter filters={filters} onFilterChange={onFilterChange} />
            <Separator />
            <CategoryFilters filters={filters} onFilterChange={onFilterChange} />
            <Separator />
            <BudgetFilter filters={filters} onFilterChange={onFilterChange} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}