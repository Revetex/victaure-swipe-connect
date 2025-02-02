import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GoogleSearchBox } from "../../../components/google-search/GoogleSearchBox";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
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
  const [showResults, setShowResults] = useState(false);
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
        toast.success("Suggestions régénérées");
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error("Erreur lors du chargement des suggestions");
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
      setShowResults(false);
    };
  }, []);

  const applySuggestion = (suggestion: string) => {
    const searchInput = document.querySelector('.gsc-input-box input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = suggestion;
      const searchButton = document.querySelector('.gsc-search-button') as HTMLButtonElement;
      if (searchButton) {
        setShowResults(true);
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
    <div className="w-full space-y-2 sm:space-y-4 px-2 sm:px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="w-full flex items-center justify-between bg-secondary/30 backdrop-blur-sm rounded-lg p-2 sm:p-3 hover:bg-secondary/40 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary animate-pulse" />
            <span className="text-xs sm:text-sm font-medium">Suggestions IA</span>
          </div>
          {showSuggestions ? (
            <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
        </Button>

        <motion.div
          initial={false}
          animate={{ 
            height: showSuggestions ? "auto" : 0,
            opacity: showSuggestions ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="pt-2 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchSuggestions}
              className="h-7 w-7 p-0 ml-2 flex-shrink-0"
              disabled={loadingSuggestions}
            >
              {loadingSuggestions ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
      
      <div className="relative w-full min-h-[44px] bg-background rounded-lg">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`w-full transition-all duration-300 ${!showResults ? 'h-[44px] overflow-hidden' : ''}`}
          onClick={() => setShowResults(true)}
        >
          <GoogleSearchBox onSearch={() => setShowResults(true)} />
        </motion.div>
      </div>
      
      <p className="text-[10px] sm:text-xs text-muted-foreground text-center italic">
        Conseil : Cliquez sur les suggestions ou utilisez vos propres mots-clés
      </p>
    </div>
  );
}