import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { JobList } from "./jobs/JobList";
import { JobFilters } from "./jobs/JobFilters";
import { useIsMobile } from "@/hooks/use-mobile";

export function Marketplace() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Emplois disponibles</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filtres
            </Button>
          </SheetTrigger>
          <SheetContent side={isMobile ? "left" : "right"} className="w-full sm:w-[540px]">
            <div className="h-full py-6 overflow-y-auto">
              <JobFilters />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <JobList />
      </div>
    </div>
  );
}