import { useGoogleSearchStyles } from "@/components/google-search/GoogleSearchStyles";
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";
import { AISearchSuggestions } from "@/components/google-search/AISearchSuggestions";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

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
    <div className="w-full space-y-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full relative [&_.gsc-input-box]:!bg-transparent [&_.gsc-input]:!bg-transparent [&_.gsc-search-button]:!bg-primary"
      >
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute right-4 -top-10 z-10">
            <AISearchSuggestions onSuggestionClick={handleSuggestionClick} />
          </div>
          <GoogleSearchBox />
        </div>
      </motion.div>
    </div>
  );
}