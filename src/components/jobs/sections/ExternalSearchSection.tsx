import { useGoogleSearchStyles } from "@/components/google-search/GoogleSearchStyles";
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";
import { AISearchSuggestions } from "@/components/google-search/AISearchSuggestions";
import { motion } from "framer-motion";

export function ExternalSearchSection() {
  useGoogleSearchStyles();

  const handleSuggestionClick = (suggestion: string) => {
    // Find the Google search input and update its value
    const searchInput = document.querySelector('.gsc-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = suggestion;
      // Trigger the search
      const searchButton = document.querySelector('.gsc-search-button') as HTMLButtonElement;
      if (searchButton) {
        searchButton.click();
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <AISearchSuggestions onSuggestionClick={handleSuggestionClick} />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full relative [&_.gsc-input-box]:!bg-transparent [&_.gsc-input]:!bg-transparent"
        >
          <GoogleSearchBox />
        </motion.div>
      </div>
    </div>
  );
}