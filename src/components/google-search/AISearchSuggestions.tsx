
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

interface AISearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function AISearchSuggestions({ onSuggestionClick }: AISearchSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestion = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour utiliser cette fonctionnalité");
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-search-suggestions', {
        body: { userId: user.id }
      });

      if (error) throw error;
      if (!data?.suggestion) throw new Error('Aucune suggestion générée');

      console.log('Suggestion générée:', data.suggestion);
      onSuggestionClick(data.suggestion);
      
    } catch (error) {
      console.error('Erreur lors de la génération de la suggestion:', error);
      toast.error("Une erreur est survenue lors de la génération de la suggestion");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, onSuggestionClick]);

  return (
    <Button
      onClick={generateSuggestion}
      disabled={isLoading}
      size="sm"
      variant="secondary"
      className="bg-primary/10 hover:bg-primary/20 text-primary"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Génération...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Suggestions IA
        </>
      )}
    </Button>
  );
}
