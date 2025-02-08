
import { useGoogleSearchStyles } from "@/components/google-search/GoogleSearchStyles";
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";
import { AISearchSuggestions } from "@/components/google-search/AISearchSuggestions";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ScrapedJobsList } from "@/components/jobs/ScrapedJobsList";

export function ExternalSearchSection() {
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
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative">
        <div className="absolute top-2 left-2 z-10">
          <AISearchSuggestions onSuggestionClick={handleSuggestionClick} />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full relative [&_.gsc-input-box]:!bg-transparent [&_.gsc-input]:!bg-transparent [&_.gsc-search-button]:!bg-primary"
        >
          <div className="max-w-4xl mx-auto pl-32">
            <GoogleSearchBox />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm rounded-xl shadow-xl border border-border/50 overflow-hidden"
      >
        <ScrapedJobsList />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="max-w-4xl mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm border border-border/50 shadow-xl [&_.gsc-results-wrapper-overlay]:!bg-background [&_.gsc-results-wrapper-overlay]:!backdrop-blur-md [&_.gsc-results-wrapper-overlay]:!supports-[backdrop-filter]:bg-background/60"
      >
        <div className="gcse-searchresults-only"></div>
      </motion.div>
    </div>
  );
}
