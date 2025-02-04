import { useEffect, useState } from "react";
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function ExternalSearchSection() {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Search box styling */
      .gsc-input-box {
        background: transparent !important;
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 0.5rem !important;
      }
      
      .gsc-input {
        background: transparent !important;
        color: hsl(var(--foreground)) !important;
        font-family: var(--font-sans) !important;
        font-size: 0.875rem !important;
      }

      .gsc-search-button {
        background-color: hsl(var(--primary)) !important;
        color: hsl(var(--primary-foreground)) !important;
        border: none !important;
        border-radius: 0.5rem !important;
        padding: 8px 16px !important;
      }

      .gsc-search-button:hover {
        background-color: hsl(var(--primary)/0.9) !important;
      }

      /* Results styling */
      .gsc-result {
        background: transparent !important;
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 0.5rem !important;
        margin: 8px 0 !important;
        padding: 12px !important;
      }

      .gsc-result:hover {
        background-color: hsl(var(--accent)/0.1) !important;
      }

      .gsc-result .gs-title {
        color: hsl(var(--primary)) !important;
        font-family: var(--font-sans) !important;
        font-size: 1rem !important;
      }

      .gsc-result .gs-snippet {
        color: hsl(var(--muted-foreground)) !important;
        font-family: var(--font-sans) !important;
        font-size: 0.875rem !important;
      }

      /* Remove search term highlighting */
      .gs-result .gs-title b,
      .gs-result .gs-snippet b,
      .gsc-result .gs-title em,
      .gsc-result .gs-snippet em {
        color: inherit !important;
        background: none !important;
        font-weight: inherit !important;
        font-style: inherit !important;
        text-decoration: inherit !important;
      }

      /* Suggestions styling */
      .gsc-completion-container {
        position: absolute !important;
        top: 100% !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 50 !important;
        background: hsl(var(--background)) !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 0.5rem !important;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
        font-family: var(--font-sans) !important;
        margin-top: 4px !important;
      }

      .gsc-completion-container table {
        width: 100% !important;
        background: transparent !important;
      }

      .gsc-completion-container tr {
        background: transparent !important;
      }

      .gsc-completion-container td {
        background: transparent !important;
        color: hsl(var(--foreground)) !important;
        font-family: var(--font-sans) !important;
        font-size: 0.875rem !important;
        line-height: 1.5 !important;
        padding: 8px 12px !important;
      }

      .gsc-completion-container tr:hover td {
        background-color: hsl(var(--accent)/0.1) !important;
      }

      /* Remove any remaining white backgrounds */
      .gsc-control-cse,
      .gsc-control-wrapper-cse,
      .gsc-results-wrapper-nooverlay,
      .gsc-results-wrapper-visible,
      .gsc-results-wrapper-overlay,
      .gsc-results-inner-overlay,
      .gsc-results-inner-visible,
      .gsc-orderby-container,
      .gsc-webResult,
      .gsc-result {
        background: transparent !important;
      }

      /* Additional transparency fixes */
      .gsc-results .gsc-cursor-box {
        background: transparent !important;
        margin: 12px 0 !important;
      }

      .gsc-cursor-page {
        color: hsl(var(--foreground)) !important;
        background: transparent !important;
        padding: 8px 12px !important;
        border-radius: 0.25rem !important;
      }

      .gsc-cursor-page:hover,
      .gsc-cursor-current-page {
        background-color: hsl(var(--accent)/0.1) !important;
      }

      .gsc-above-wrapper-area,
      .gsc-refinementsArea {
        background: transparent !important;
        border: none !important;
      }
    `;

    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.functions.invoke('generate-search-suggestions', {
        body: { user_id: user.id }
      });

      if (error) throw error;
      setSuggestions(data.suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les suggestions"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    setShowSuggestions(false);
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={fetchSuggestions}
            disabled={isLoading}
          >
            <Sparkles className="h-4 w-4" />
            Suggestions IA
          </Button>
        </div>

        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-12 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border rounded-lg shadow-lg p-4 space-y-2"
            >
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="cursor-pointer p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

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