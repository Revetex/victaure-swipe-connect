import { JobFilters } from "./JobFilterUtils";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { JobFilters as JobFiltersComponent } from "./JobFilters";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JobFiltersPanelProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
  openLocation: boolean;
  setOpenLocation: (open: boolean) => void;
}

export function JobFiltersPanel({
  filters,
  onFilterChange,
  openLocation,
  setOpenLocation
}: JobFiltersPanelProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-b">
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
    <div className="hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <h3 className="font-semibold">Filtres</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => window.location.reload()}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
        <JobFiltersComponent
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </ScrollArea>
    </div>
  );
}