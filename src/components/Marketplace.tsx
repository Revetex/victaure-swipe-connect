import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { JobList } from "./jobs/JobList";
import { JobFilters } from "./jobs/JobFilters";
import { useIsMobile } from "@/hooks/use-mobile";
import { JobFilters as JobFiltersType, defaultFilters, applyFilters } from "./jobs/JobFilterUtils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Marketplace() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("platform");
  const hasActiveFilters = Object.values(filters).some(value => value !== "" && value !== "all");

  useEffect(() => {
    // Cleanup any existing elements
    const cleanup = () => {
      const existingElements = document.querySelectorAll('.gcse-search, .gcse-searchbox, .gcse-searchresults');
      existingElements.forEach(el => el.remove());
      
      const existingScripts = document.querySelectorAll('script[src*="cse.google.com"]');
      existingScripts.forEach(script => script.remove());
    };

    cleanup();

    // Add the Google Custom Search script
    const script = document.createElement('script');
    script.src = "https://cse.google.com/cse.js?cx=1262c5460a0314a80";
    script.async = true;
    document.head.appendChild(script);

    // Create search elements after script loads
    script.onload = () => {
      const searchBox = document.createElement('div');
      searchBox.className = 'gcse-searchbox';
      
      const searchResults = document.createElement('div');
      searchResults.className = 'gcse-searchresults';

      // Add search elements to containers
      const containers = document.querySelectorAll('.google-search-container');
      containers.forEach(container => {
        if (container instanceof HTMLElement) {
          container.innerHTML = '';
          container.appendChild(searchBox.cloneNode(true));
          container.appendChild(searchResults.cloneNode(true));
        }
      });
    };

    return cleanup;
  }, [activeTab]);

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open');

      const filteredQuery = await applyFilters(query, filters);
      const { data, error } = await filteredQuery;

      if (error) throw error;
      return (data || []) as Job[];
    },
  });

  const handleFilterChange = (key: keyof JobFiltersType, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

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
              <JobFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Tabs defaultValue="platform" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="platform">Offres Victaure</TabsTrigger>
          <TabsTrigger value="external">Recherche externe</TabsTrigger>
        </TabsList>

        <TabsContent value="platform">
          <div className="grid grid-cols-1 gap-6">
            {!hasActiveFilters ? (
              <div className="w-full min-h-[600px] bg-background rounded-lg p-4 border">
                <div className="google-search-container min-h-[500px]"></div>
              </div>
            ) : (
              <JobList 
                jobs={jobs}
                isLoading={isLoading}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="external" className="min-h-[600px]">
          <div className="bg-background rounded-lg p-4 border">
            <div className="google-search-container min-h-[500px]"></div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}