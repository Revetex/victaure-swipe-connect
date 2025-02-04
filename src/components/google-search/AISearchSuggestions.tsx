import { Button } from "@/components/ui/button";
import { Sparkles, Search } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AISearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function AISearchSuggestions({ onSuggestionClick }: AISearchSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = useCallback(() => {
    try {
      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    } catch (error) {
      console.error('Error focusing search input:', error);
    }
  }, []);

  const generateSuggestion = useCallback(async () => {
    if (isLoading) return;
    
    // Cancel any previous ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'generate-search-suggestions',
        {
          body: {
            userId: user.id,
            context: {
              userPreferences: {
                language: 'fr',
                region: 'CA',
                searchHistory: []
              },
              currentTime: new Date().toISOString(),
              userIntent: 'discovery'
            },
            parameters: {
              creativity: 0.8,
              relevance: 0.9,
              diversity: true,
              maxSuggestions: 10
            }
          }
        }
      );

      if (functionError) throw functionError;

      const suggestion = functionData?.suggestion;
      if (!suggestion) throw new Error("Aucune suggestion générée");

      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
      if (!searchInput) throw new Error("Champ de recherche non trouvé");

      searchInput.value = suggestion;
      onSuggestionClick(suggestion);
      searchInput.focus();

      // Recursively generate next suggestion after a short delay
      setTimeout(() => {
        if (!abortControllerRef.current?.signal.aborted) {
          generateSuggestion();
        }
      }, 3000); // Generate a new suggestion every 3 seconds

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Ignore abort errors
        return;
      }
      console.error('Error generating suggestion:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la génération de la suggestion");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, onSuggestionClick]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={generateSuggestion}
        disabled={isLoading}
      >
        <Sparkles className="h-4 w-4" />
        Suggestion IA
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={handleSearch}
      >
        <Search className="h-4 w-4" />
        Rechercher
      </Button>
    </div>
  );
}