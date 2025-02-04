import { useEffect, useState } from "react";
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { RefreshCw, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ExternalSearchSectionProps {
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export function ExternalSearchSection({ 
  isLoading = false, 
  hasError = false, 
  errorMessage 
}: ExternalSearchSectionProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [usedSuggestions] = useState(new Set<string>());

  // Add styles to fix search results visibility
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .gsc-results-wrapper-overlay {
        background-color: hsl(var(--background)) !important;
      }
      .gs-title, .gs-snippet {
        color: hsl(var(--foreground)) !important;
      }
      .gsc-input {
        font-family: var(--font-sans) !important;
      }
      .gsc-completion-container {
        background: hsl(var(--background)) !important;
        color: hsl(var(--foreground)) !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchSuggestions = async () => {
    try {
      setIsRefreshing(true);
      setIsFetchingSuggestions(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour voir les suggestions");
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-search-suggestions', {
        body: { user_id: user.id }
      });

      if (error) throw error;
      if (data?.suggestions) {
        const newSuggestions = data.suggestions.filter(
          (suggestion: string) => !usedSuggestions.has(suggestion)
        );
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
        toast.success("Nouvelles suggestions générées!");
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error("Erreur lors de la génération des suggestions");
    } finally {
      setIsRefreshing(false);
      setIsFetchingSuggestions(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    const searchInput = document.querySelector('.gsc-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = suggestion;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      usedSuggestions.add(suggestion);
      setSuggestions(prevSuggestions => 
        prevSuggestions.filter(s => s !== suggestion)
      );

      setTimeout(() => {
        const searchButton = document.querySelector('.gsc-search-button-v2') as HTMLButtonElement;
        if (searchButton) {
          searchButton.click();
        }
      }, 100);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Card className="p-4 bg-background/60 backdrop-blur-sm border border-border/50">
        <div className="mb-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-full relative group transition-all duration-300 bg-background/80 hover:bg-background/90 border border-border/50 shadow-sm hover:shadow-md"
          >
            <div className="absolute -left-2 top-1/2 -translate-y-1/2">
              <motion.div
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
              >
                <Sparkles className="w-5 h-5 text-blue-500" />
              </motion.div>
            </div>
            <span className="flex items-center gap-2 text-foreground/80">
              Suggestions IA personnalisées
              {showSuggestions ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
            <motion.div
              className="absolute -right-2 top-1/2 -translate-y-1/2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  fetchSuggestions();
                }}
                disabled={isRefreshing}
                className="h-8 w-8 rounded-full bg-blue-500/10 hover:bg-blue-500/20"
              >
                <RefreshCw className={`h-4 w-4 text-blue-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </motion.div>
          </Button>
        </div>

        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-4"
            >
              <div className="space-y-2">
                {isFetchingSuggestions ? (
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-8 w-36" />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-sm px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-200 border border-primary/20 hover:border-primary/30"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full [&_.gsc-input-box]:!bg-transparent [&_.gsc-input]:!bg-transparent relative"
        >
          <GoogleSearchBox />
        </motion.div>
      </Card>
    </div>
  );
}