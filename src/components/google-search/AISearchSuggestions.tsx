
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AISearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function AISearchSuggestions({ onSuggestionClick }: AISearchSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const generateSuggestions = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setIsOpen(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('generate-search-suggestions', {
        body: { userId: user.id }
      });

      if (error) throw error;
      if (!data?.suggestions || !Array.isArray(data.suggestions)) {
        throw new Error('Format de réponse invalide');
      }

      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Une erreur est survenue lors de la génération des suggestions');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={generateSuggestions}
          disabled={isLoading}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Suggestions IA
        </Button>
      </PopoverTrigger>
      {suggestions.length > 0 && (
        <PopoverContent className="w-80" align="start">
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
