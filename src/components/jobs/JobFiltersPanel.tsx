
import { JobFilters } from "./JobFilters";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import type { JobFilters as JobFiltersType } from "./JobFilterUtils";

interface JobFiltersPanelProps {
  filters: JobFiltersType;
  onFilterChange: (key: keyof JobFiltersType, value: any) => void;
  onReset?: () => void;  // Add this prop
}

export function JobFiltersPanel({ filters, onFilterChange, onReset }: JobFiltersPanelProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Filtres de recherche</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <JobFilters 
            filters={filters}
            onFilterChange={onFilterChange}
            onReset={onReset}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
