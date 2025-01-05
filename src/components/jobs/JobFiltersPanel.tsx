import { JobFilters } from "./JobFilterUtils";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { JobFilters as JobFiltersComponent } from "./JobFilters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface JobFiltersPanelProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  openLocation: boolean;
  setOpenLocation: (open: boolean) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export function JobFiltersPanel({
  filters,
  onFilterChange,
  openLocation,
  setOpenLocation,
  showFilters,
  setShowFilters
}: JobFiltersPanelProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Filtres</SheetTitle>
              <SheetDescription>
                Affinez votre recherche avec les filtres ci-dessous
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-10rem)] mt-4 pr-4">
              <JobFiltersComponent
                filters={filters}
                onFilterChange={onFilterChange}
              />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-sm"
    >
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4">
          <JobFiltersComponent
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </div>
      </ScrollArea>
    </motion.div>
  );
}