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
}

export function JobFiltersPanel({
  filters,
  onFilterChange,
}: JobFiltersPanelProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 border-b border-white/10">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="lg" className="w-full bg-white/5 hover:bg-white/10 text-white border-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-lg bg-gray-900/95 border-white/10">
            <SheetHeader>
              <SheetTitle className="text-white">Filtres</SheetTitle>
              <SheetDescription className="text-gray-400">
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
      className="bg-gray-900/95 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl overflow-hidden"
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