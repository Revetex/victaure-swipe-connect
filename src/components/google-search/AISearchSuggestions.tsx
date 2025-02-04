import { Button } from "@/components/ui/button";
import { Sparkles, Search } from "lucide-react";
import { useState, useCallback, useRef } from "react";
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
      const searchInput = document.querySelector('.gsc-input-box input') as HTMLInputElement;
      if (!searchInput) {
        toast.error("Impossible de trouver la barre de recherche");
        return;
      }

      const searchButton = document.querySelector('.gsc-search-button-v2') as HTMLButtonElement;
      if (!searchButton) {
        toast.error("Impossible de trouver le bouton de recherche");
        return;
      }

      searchButton.click();
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Une erreur est survenue lors de la recherche");
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
      const searchInput = document.querySelector('.gsc-input-box input') as HTMLInputElement;
      if (!searchInput) {
        throw new Error("Impossible de trouver la barre de recherche");
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      
      if (!user?.id) {
        throw new Error("Vous devez être connecté pour utiliser cette fonctionnalité");
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const query = searchInput.value.trim() || "emploi construction";

      const { data, error: functionError } = await supabase.functions.invoke('generate-search-suggestions', {
        body: {
          query,
          user_id: user.id,
          context: {
            profile,
            useHuggingFace: true,
            creativity: 0.9,
            diversity: true,
            maxSuggestions: 10
          }
        },
        signal: abortControllerRef.current.signal,
      });

      if (functionError) throw functionError;

      if (!data?.suggestions?.length) {
        throw new Error("Aucune suggestion disponible");
      }

      // Get a random suggestion from the array
      const randomIndex = Math.floor(Math.random() * data.suggestions.length);
      const suggestion = data.suggestions[randomIndex];
      
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
      <div className="relative flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={generateSuggestion}
          disabled={isLoading}
          className="mr-2"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          <span>IA</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}