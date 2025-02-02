import { useEffect } from "react";
import { motion } from "framer-motion";
import { GoogleSearchBox } from "../../../components/google-search/GoogleSearchBox";

interface ExternalSearchSectionProps {
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export function ExternalSearchSection({
  isLoading,
  hasError,
  errorMessage,
}: ExternalSearchSectionProps) {
  useEffect(() => {
    // Clear search results when component unmounts
    return () => {
      const searchElement = document.querySelector('.gcse-search') as HTMLElement;
      if (searchElement) {
        // Clear the search input
        const inputElement = searchElement.querySelector('input[type="text"]') as HTMLInputElement;
        if (inputElement) {
          inputElement.value = '';
        }
        // Clear the results
        const resultsElement = document.querySelector('.gsc-results-wrapper-visible');
        if (resultsElement) {
          resultsElement.innerHTML = '';
        }
      }
    };
  }, []);

  if (hasError) {
    return (
      <div className="text-center p-4 text-red-500">
        {errorMessage || "Une erreur s'est produite lors de la recherche"}
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div className="relative w-full min-h-[100px] bg-background rounded-lg">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full"
        >
          <GoogleSearchBox />
        </motion.div>
      </div>
      
      <p className="text-sm text-muted-foreground text-center italic px-4">
        Conseil : Essayez des mots-clés comme "construction", "comptable" ou une ville (ex: "Alma") pour trouver des offres pertinentes
      </p>
    </div>
  );
}