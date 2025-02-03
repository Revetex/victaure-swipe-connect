import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleSearchBox } from "../../../components/google-search/GoogleSearchBox";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Loader2, RefreshCw, Sparkles } from "lucide-react";

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
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  useEffect(() => {
    return () => {
      const searchElement = document.querySelector('.gcse-search') as HTMLElement;
      if (searchElement) {
        const inputElement = searchElement.querySelector('input[type="text"]') as HTMLInputElement;
        if (inputElement) {
          inputElement.value = '';
        }
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
    <div className="w-full space-y-2 px-2 sm:px-4 -mt-4">
      <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-pulse" />
            <h3 className="text-xs sm:text-sm font-medium">Suggestions IA</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchSuggestions}
              className="h-7 w-7 p-0"
              disabled={loadingSuggestions}
            >
              {loadingSuggestions ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="h-7 w-7 p-0"
            >
              {showSuggestions ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
        
        <AnimatePresence>
          {showSuggestions && (
            <motion.div 
              className="flex flex-wrap gap-1.5 sm:gap-2 mt-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 text-[11px] sm:text-xs whitespace-nowrap bg-background/50 hover:bg-background/80 px-2 py-0"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    {suggestion}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="relative w-full min-h-[44px] bg-background/50 backdrop-blur-sm rounded-lg border border-border/50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full [&_.gsc-input-box]:!bg-background/50 [&_.gsc-input-box]:!border-border/50 [&_.gsc-input]:!bg-transparent"
        >
          <GoogleSearchBox />
        </motion.div>
      </div>
      
      <p className="text-[10px] sm:text-xs text-muted-foreground text-center italic">
        Conseil : Cliquez sur les suggestions ou utilisez vos propres mots-clés
      </p>
    </div>
  );
}