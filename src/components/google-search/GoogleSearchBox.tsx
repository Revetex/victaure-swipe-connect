
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function GoogleSearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    // Initialize Google Custom Search
    const script = document.createElement('script');
    script.src = "https://cse.google.com/cse.js?cx=1262c5460a0314a80";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      document.head.removeChild(script);
    };
  }, []);

  const handleSearch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Génère des suggestions via l'Edge Function
      const { data, error } = await supabase.functions.invoke('generate-search-suggestions', {
        body: { userId: user.id }
      });

      if (error) throw error;
      if (data?.suggestion) {
        setSuggestions(prev => [...prev, data.suggestion]);
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Rechercher un emploi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch} className="shrink-0">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </div>
      
      {/* Google Custom Search Element */}
      <div className="gcse-search"></div>
      
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm(suggestion)}
              className="text-sm"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
