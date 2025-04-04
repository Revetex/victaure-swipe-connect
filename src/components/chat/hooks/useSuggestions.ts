
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const generateSuggestions = useCallback(async (context: string, messageHistory: any[]) => {
    setIsLoadingSuggestions(true);
    try {
      const { data, error } = await supabase.functions.invoke('chat-suggestions', {
        body: { context, messageHistory }
      });

      if (error) throw error;

      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error("Impossible de générer des suggestions");
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  return {
    suggestions,
    isLoadingSuggestions,
    generateSuggestions
  };
}
