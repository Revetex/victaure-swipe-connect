import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
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
    const searchInput = document.querySelector('.gsc-input-box input') as HTMLInputElement;
    if (searchInput && searchInput.value) {
      const searchButton = document.querySelector('.gsc-search-button-v2') as HTMLButtonElement;
      if (searchButton) {
        searchButton.click();
      }
    } else {
      toast.error("Veuillez entrer un terme de recherche");
    }
  }, []);

  const generateSuggestion = useCallback(async () => {
    setIsLoading(true);
    try {
      const searchInput = document.querySelector('.gsc-input-box input') as HTMLInputElement;
      const query = searchInput?.value || '';

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const { data, error } = await supabase.functions.invoke('generate-search-suggestions', {
        body: {
          query,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          context: {
            profile,
            previousSuggestions
          }
        }
      });

      if (error) throw error;

      if (data?.suggestions?.length > 0) {
        const suggestion = data.suggestions[0];
        setPreviousSuggestions(prev => [...prev, suggestion]);
        onSuggestionClick(suggestion);
      } else {
        toast.error("Aucune suggestion disponible");
      }
    } catch (error) {
      console.error('Error generating suggestion:', error);
      toast.error("Erreur lors de la génération de la suggestion");
    } finally {
      setIsLoading(false);
    }
  }, [onSuggestionClick, previousSuggestions]);

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={generateSuggestion}
          disabled={isLoading}
          className="absolute left-2 z-10"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          <span>IA</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSearch}
          className="absolute right-2 z-10"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}