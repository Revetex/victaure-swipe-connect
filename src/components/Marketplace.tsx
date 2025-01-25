import { useState, useEffect, useRef } from "react";
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

declare global {
  interface Window {
    google: {
      search: {
        cse: {
          element: {
            render: (options: { div: string }) => void;
          };
        };
      };
    };
  }
}

export function Marketplace() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const isMobile = useIsMobile();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("platform");

  useEffect(() => {
    // Only load the script if we're on the external tab
    if (activeTab === "external") {
      // Remove any existing script to avoid duplicates
      const existingScript = document.getElementById("google-search-script");
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = "google-search-script";
      script.src = "https://cse.google.com/cse.js?cx=1262c5460a0314a80";
      script.async = true;
      
      script.onload = () => {
        if (searchContainerRef.current) {
          // Clear the container first
          searchContainerRef.current.innerHTML = '';
          // Create a new element for the search
          const searchElement = document.createElement('div');
          searchElement.className = 'gcse-search';
          searchContainerRef.current.appendChild(searchElement);
          
          // Initialize the search
          if (window.google && window.google.search) {
            window.google.search.cse.element.render({
              div: searchContainerRef.current.id
            });
          }
        }
      };

      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
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
            <JobList 
              jobs={jobs}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="external" className="min-h-[600px]">
          <div className="bg-background rounded-lg p-4 border">
            <div 
              id="google-search-container"
              ref={searchContainerRef}
              className="w-full min-h-[400px]"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}