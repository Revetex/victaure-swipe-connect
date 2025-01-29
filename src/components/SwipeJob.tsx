import { useState, useEffect } from "react";
import { JobFilters, defaultFilters } from "./jobs/JobFilterUtils";
import { Search, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { JobCreationDialog } from "./jobs/JobCreationDialog";
import { BrowseJobsTab } from "./jobs/BrowseJobsTab";
import { Separator } from "./ui/separator";

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [filters, setFilters] = useState<JobFilters>(defaultFilters);

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
    script.src = "https://cse.google.com/cse.js?cx=85fd4a0d6d6a44d0a";
    script.async = true;
    document.head.appendChild(script);

    // Create search elements after script loads
    script.onload = () => {
      const searchBox = document.createElement('div');
      searchBox.className = 'gcse-searchbox';
      
      const searchResults = document.createElement('div');
      searchResults.className = 'gcse-searchresults';

      // Add search elements to container
      const container = document.querySelector('.google-search-container');
      if (container) {
        container.innerHTML = '';
        container.appendChild(searchBox);
        container.appendChild(searchResults);
      }
    };

    return cleanup;
  }, []);

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    if (key === "category" && value !== filters.category) {
      setFilters(prev => ({ ...prev, [key]: value, subcategory: "all" }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="h-full w-full bg-background/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between p-6 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-primary" />
          <motion.h2 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-2xl font-bold text-foreground"
          >
            Offres disponibles
          </motion.h2>
        </div>
        
        <JobCreationDialog 
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSuccess={() => {}}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-6 space-y-6 max-w-7xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BrowseJobsTab 
                filters={filters}
                onFilterChange={handleFilterChange}
                openLocation={openLocation}
                setOpenLocation={setOpenLocation}
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="google-search-container min-h-[800px]">
                {/* Google Custom Search elements will be injected here */}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}