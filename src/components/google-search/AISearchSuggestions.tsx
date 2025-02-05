import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AISearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function AISearchSuggestions({ onSuggestionClick }: AISearchSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const input = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (input) {
      searchInputRef.current = input;
    }
  }, []);

  const generateSuggestion = useCallback(async () => {
    if (isLoading) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('get_secret', {
        secret_name: 'HUGGING_FACE_API_KEY'
      });

      if (error) throw error;
      if (!data?.[0]?.secret) throw new Error('API key not found');

      const response = await fetch(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        {
          headers: { Authorization: `Bearer ${data[0].secret}` },
          method: 'POST',
          body: JSON.stringify({
            inputs: searchInputRef.current?.value || '',
            parameters: { max_length: 100, min_length: 30, do_sample: true }
          }),
          signal: abortControllerRef.current.signal
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate suggestion');
      }

      const suggestion = await response.text();
      
      if (suggestion && !abortControllerRef.current?.signal.aborted) {
        onSuggestionClick(suggestion);
      }

      setTimeout(() => {
        if (!abortControllerRef.current?.signal.aborted) {
          generateSuggestion();
        }
      }, 3000);

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Error generating suggestion:', error);
      toast.error('Failed to generate suggestion');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, onSuggestionClick]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={generateSuggestion}
        disabled={isLoading}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {isLoading ? 'Generating...' : 'Get AI Suggestions'}
      </button>
    </div>
  );
}