import { Button } from "@/components/ui/button";
import { Sparkles, Search } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AISearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function AISearchSuggestions({ onSuggestionClick }: AISearchSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previousSuggestions, setPreviousSuggestions] = useState<string[]>([]);

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
    if (isLoading) return; // Prevent multiple simultaneous requests
    
    setIsLoading(true);
    try {
      // Focus the search input first
      const searchInput = document.querySelector('.gsc-input-box input') as HTMLInputElement;
      if (!searchInput) {
        throw new Error("Impossible de trouver la barre de recherche");
      }

      // Get the user data first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      
      if (!user?.id) {
        throw new Error("Vous devez être connecté pour utiliser cette fonctionnalité");
      }

      // Get the user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Use empty string if no query is present
      const query = searchInput.value.trim() || "emploi";

      // Prevent duplicate suggestions
      if (previousSuggestions.includes(query)) {
        throw new Error("Cette suggestion a déjà été utilisée");
      }

      // Call the edge function with the collected data
      const { data, error: functionError } = await supabase.functions.invoke('generate-search-suggestions', {
        body: {
          query,
          user_id: user.id,
          context: {
            profile,
            previousSuggestions
          }
        }
      });

      if (functionError) throw functionError;

      if (!data?.suggestions?.length) {
        throw new Error("Aucune suggestion disponible");
      }

      const suggestion = data.suggestions[0];
      setPreviousSuggestions(prev => [...prev, suggestion]);
      onSuggestionClick(suggestion);
      
      // Focus the search input after suggestion
      searchInput.focus();

    } catch (error) {
      console.error('Error generating suggestion:', error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de la génération de la suggestion");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, onSuggestionClick, previousSuggestions]);

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