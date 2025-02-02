import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GoogleSearchBox } from "../../../components/google-search/GoogleSearchBox";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoadingSuggestions(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('No authenticated user');
          return;
        }

        const { data, error } = await supabase.functions.invoke('generate-search-suggestions', {
          body: { user_id: user.id }
        });

        if (error) throw error;
        
        if (data?.suggestions) {
          setSuggestions(data.suggestions);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        toast.error("Erreur lors du chargement des suggestions");
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, []);

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

  const applySuggestion = (suggestion: string) => {
    const searchInput = document.querySelector('.gsc-input-box input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = suggestion;
      // Trigger the search
      const searchButton = document.querySelector('.gsc-search-button') as HTMLButtonElement;
      if (searchButton) {
        searchButton.click();
      }
    }
  };

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
      
      {loadingSuggestions ? (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Chargement des suggestions...</span>
        </div>
      ) : suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center px-4">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="secondary"
              size="sm"
              className="text-xs"
              onClick={() => applySuggestion(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
      
      <p className="text-sm text-muted-foreground text-center italic px-4">
        Conseil : Cliquez sur les suggestions ou utilisez vos propres mots-clés pour trouver des offres pertinentes
      </p>
    </div>
  );
}