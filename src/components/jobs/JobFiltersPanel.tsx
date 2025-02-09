
import { JobFilters } from "./JobFilterUtils";
import { Button } from "@/components/ui/button";
import { Filter, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { JobFilters as JobFiltersComponent } from "./JobFilters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface JobFiltersPanelProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function JobFiltersPanel({
  filters,
  onFilterChange,
}: JobFiltersPanelProps) {
  const isMobile = useIsMobile();

  const handleResetFilters = () => {
    // On réinitialise tous les filtres
    const filterKeys = Object.keys(filters) as Array<keyof JobFilters>;
    filterKeys.forEach(key => {
      onFilterChange(key, null);
    });
    toast.success("Les filtres ont été réinitialisés");
  };

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full bg-background/60 hover:bg-background/80 border-border/50 backdrop-blur-sm"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="w-full sm:max-w-lg border-r border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <SheetHeader className="space-y-1">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <ArrowLeft className="h-5 w-5" />
              Filtres de recherche
            </SheetTitle>
            <SheetDescription className="text-muted-foreground text-sm">
              Affinez votre recherche avec les filtres ci-dessous
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-10rem)] mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="px-4"
              >
                <JobFiltersComponent
                  filters={filters}
                  onFilterChange={onFilterChange}
                />
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <motion.aside 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-4 w-full bg-background/60 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm overflow-hidden"
    >
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4">
          <JobFiltersComponent
            filters={filters}
            onFilterChange={onFilterChange}
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 pt-4 border-t border-border/50"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Réinitialiser les filtres
            </Button>
          </motion.div>
        </div>
      </ScrollArea>
    </motion.aside>
  );
}
