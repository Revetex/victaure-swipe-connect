
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
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="lg" className="w-full bg-background/60 hover:bg-background/80 border-border/50">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Filtres</SheetTitle>
            <SheetDescription className="text-muted-foreground">
              Affinez votre recherche avec les filtres ci-dessous
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-10rem)] mt-4">
            <div className="pr-4">
              <JobFiltersComponent
                filters={filters}
                onFilterChange={onFilterChange}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <motion.aside 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-4 w-full max-w-xs bg-background/60 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm"
    >
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4">
          <JobFiltersComponent
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </div>
      </ScrollArea>
    </motion.aside>
  );
}
