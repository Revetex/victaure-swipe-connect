
import { useState } from "react";
import { AISearchBar } from "./AISearchBar";
import { AISearchResults } from "./AISearchResults";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AISearchViewProps {
  className?: string;
}

export function AISearchView({ className }: AISearchViewProps) {
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { query }
      });

      if (error) throw error;
      
      setResults(data.results);
      
      if (data.results.length === 0) {
        toast.info("Aucun résultat trouvé pour votre recherche");
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Une erreur est survenue lors de la recherche");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <AISearchBar
        onSearch={handleSearch}
        isSearching={isSearching}
        className={className}
      />
      <AISearchResults
        results={results}
        isLoading={isSearching}
        onResultClick={(result) => {
          toast.success(`Élément sélectionné : ${result.title}`);
          // Implement navigation or action based on result type
        }}
      />
    </div>
  );
}
