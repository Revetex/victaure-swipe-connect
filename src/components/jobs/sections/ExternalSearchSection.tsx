
import { useGoogleSearchStyles } from "@/components/google-search/GoogleSearchStyles";
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";
import { AISearchSuggestions } from "@/components/google-search/AISearchSuggestions";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ScrapedJobsList } from "@/components/jobs/ScrapedJobsList";
import { JobFilters } from "@/components/jobs/JobFilterUtils";

interface ExternalSearchSectionProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function ExternalSearchSection({ filters, onFilterChange }: ExternalSearchSectionProps) {
  useGoogleSearchStyles();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSuggestionClick = (suggestion: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const searchInput = document.querySelector('.gsc-input-box input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = suggestion;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      searchTimeoutRef.current = setTimeout(() => {
        const searchButton = document.querySelector('.gsc-search-button-v2') as HTMLButtonElement;
        if (searchButton) {
          searchButton.click();
        }
      }, 300);
    }
  };

  useEffect(() => {
    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Utilisez l'attribut loading="lazy" pour les iframes de recherche Google
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Section */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full relative [&_.gsc-input-box]:!bg-background [&_.gsc-input]:!bg-background [&_.gsc-search-button]:!bg-primary"
          >
            <div className="absolute left-2 top-2 z-10">
              <AISearchSuggestions onSuggestionClick={handleSuggestionClick} />
            </div>
            <div className="pl-32">
              <GoogleSearchBox />
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-card/50 backdrop-blur-sm rounded-xl shadow-lg border border-border/50 overflow-hidden"
          >
            <div className="p-6">
              <ScrapedJobsList queryString={filters.searchTerm} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="max-w-4xl mx-auto rounded-xl overflow-hidden"
          >
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg p-6 rounded-xl
              [&_.gsc-results-wrapper-overlay]:!bg-background 
              [&_.gsc-results-wrapper-overlay]:!backdrop-blur-md 
              [&_.gsc-results-wrapper-overlay]:!supports-[backdrop-filter]:bg-background/60"
            >
              <div className="gcse-searchresults-only" data-queryParameterName="q"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
