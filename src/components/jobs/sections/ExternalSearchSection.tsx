import { useEffect, useState } from "react";
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

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

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase.functions.invoke('generate-search-suggestions', {
          body: { user_id: user.id }
        });

        if (error) throw error;
        if (data?.suggestions) {
          setSuggestions(data.suggestions);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

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
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full [&_.gsc-input-box]:!bg-transparent [&_.gsc-input]:!bg-transparent"
        >
          <GoogleSearchBox />
        </motion.div>

        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-2"
          >
            <p className="text-sm text-muted-foreground font-medium">Suggestions de recherche :</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const searchInput = document.querySelector('.gsc-input') as HTMLInputElement;
                    if (searchInput) {
                      searchInput.value = suggestion;
                      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                  }}
                  className="text-sm px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
}