import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { AISearchButton } from "@/components/search/AISearchButton";
import { LoadingSkeleton } from "@/components/search/LoadingSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AISearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function AISearchSuggestions({ onSuggestionClick }: AISearchSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const previousSuggestionsRef = useRef<Set<string>>(new Set());

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const searchInput = document.querySelector('.gsc-input-box input') as HTMLInputElement;
      if (!searchInput?.value) {
        toast.error("Veuillez entrer un terme de recherche");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour utiliser cette fonctionnalité");
        return;
      }

      // Get user profile for context
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data, error } = await supabase.functions.invoke('generate-search-suggestions', {
        body: { 
          query: searchInput.value,
          user_id: user.id,
          context: {
            profile,
            previousSuggestions: Array.from(previousSuggestionsRef.current)
          }
        }
      });

      if (error) throw error;

      if (data?.suggestions?.length > 0) {
        // Filter out any suggestions we've already used
        const newSuggestions = data.suggestions.filter(
          (suggestion: string) => !previousSuggestionsRef.current.has(suggestion)
        );

        if (newSuggestions.length > 0) {
          const suggestion = newSuggestions[0];
          previousSuggestionsRef.current.add(suggestion);
          onSuggestionClick(suggestion);
        } else {
          toast.info("Toutes les suggestions ont été utilisées, essayez une nouvelle recherche");
        }
      } else {
        toast.info("Aucune suggestion trouvée pour cette recherche");
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error("Une erreur est survenue lors de la génération des suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <AISearchButton onClick={handleClick} isLoading={isLoading} />
      <AnimatePresence>
        {isLoading && <LoadingSkeleton />}
      </AnimatePresence>
    </div>
  );
}