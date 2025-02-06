
import { useGoogleSearchStyles } from "@/components/google-search/GoogleSearchStyles";
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";
import { AISearchSuggestions } from "@/components/google-search/AISearchSuggestions";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function ExternalSearchSection() {
  useGoogleSearchStyles();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSuggestionClick = (suggestion: string) => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Find the Google search input
    const searchInput = document.querySelector('.gsc-input-box input') as HTMLInputElement;
    if (searchInput) {
      // Set the value and dispatch input event
      searchInput.value = suggestion;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Wait a short moment for the Google Search to initialize
      searchTimeoutRef.current = setTimeout(() => {
        // Find and click the search button
        const searchButton = document.querySelector('.gsc-search-button-v2') as HTMLButtonElement;
        if (searchButton) {
          searchButton.click();
        }
      }, 300);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <div className="absolute top-0 left-0 z-10">
          <AISearchSuggestions onSuggestionClick={handleSuggestionClick} />
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full relative [&_.gsc-input-box]:!bg-transparent [&_.gsc-input]:!bg-transparent [&_.gsc-search-button]:!bg-primary-foreground"
        >
          <GoogleSearchBox />
        </motion.div>
      </div>
    </div>
  );
}
