import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function GoogleSearchBox() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(
          `${process.env.SUPABASE_URL}/functions/v1/generate-search-suggestions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ user_id: user.id }),
          }
        );

        const data = await response.json();
        if (data.suggestions) {
          setSuggestions(data.suggestions);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, [user]);

  const handleSearch = (term: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(term)}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un emploi..."
          className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button onClick={() => handleSearch(searchTerm)}>
          <Search className="h-5 w-5" />
        </Button>
      </div>
      
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSearch(suggestion)}
              className="px-3 py-1 text-sm bg-accent rounded-full hover:bg-accent/80 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}