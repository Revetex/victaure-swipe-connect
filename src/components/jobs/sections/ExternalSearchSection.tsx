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
        setSuggestions(data.suggestions);
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

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Google Search Box styling */
      .gsc-control-cse {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
      }

      .gsc-search-box {
        margin-bottom: 0 !important;
      }

      .gsc-input-box {
        border: 2px solid hsl(var(--border)) !important;
        border-radius: 0.5rem !important;
        background: transparent !important;
      }

      .gsc-input {
        background: transparent !important;
        color: hsl(var(--foreground)) !important;
      }

      /* Results styling */
      .gsc-results-wrapper-overlay {
        background: hsl(var(--background)) !important;
        backdrop-filter: blur(12px) !important;
      }

      .gsc-webResult.gsc-result {
        background: transparent !important;
        border: none !important;
      }

      .gs-title, .gs-snippet {
        color: hsl(var(--muted-foreground)) !important;
        font-family: var(--font-sans) !important;
        font-size: 0.875rem !important;
      }

      /* Remove highlighting of search terms */
      .gs-title b,
      .gs-snippet b,
      .gsc-result b {
        color: inherit !important;
        font-weight: inherit !important;
        background: none !important;
      }

      /* Suggestions styling */
      .gsc-completion-container {
        background: hsl(var(--background)) !important;
        border: 1px solid hsl(var(--border)) !important;
        backdrop-filter: blur(12px) !important;
      }

      .gsc-completion-title {
        color: hsl(var(--foreground)) !important;
      }

      /* Pagination styling */
      .gsc-cursor-box {
        margin: 16px 0 !important;
      }

      .gsc-cursor-page {
        color: hsl(var(--muted-foreground)) !important;
        background: transparent !important;
        padding: 8px !important;
      }

      .gsc-cursor-current-page {
        color: hsl(var(--foreground)) !important;
        font-weight: bold !important;
      }

      /* Close button styling */
      .gsc-modal-background-image {
        background: rgba(0, 0, 0, 0.5) !important;
        backdrop-filter: blur(4px) !important;
      }

      /* Additional styling for better integration */
      .gcsc-find-more-on-google {
        color: hsl(var(--muted-foreground)) !important;
      }

      .gcsc-find-more-on-google-root {
        background: transparent !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (hasError) {
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div className="w-full space-y-4">
      <Card className="p-4">
        <div className="mb-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-full relative group glass-effect hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute -left-2 top-1/2 -translate-y-1/2">
              <motion.div
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
            </div>
            <span className="flex items-center gap-2">
              Suggestions IA pour votre profil
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
                className="h-8 w-8 rounded-full bg-primary/10"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
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
                    <Skeleton className="h-8 w-44" />
                    <Skeleton className="h-8 w-38" />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          const searchInput = document.querySelector('.gsc-input') as HTMLInputElement;
                          if (searchInput) {
                            searchInput.value = suggestion;
                            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                          }
                        }}
                        className="text-sm px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
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
          className="w-full [&_.gsc-input-box]:!bg-transparent [&_.gsc-input]:!bg-transparent"
        >
          <GoogleSearchBox />
        </motion.div>
      </Card>
    </div>
  );
}