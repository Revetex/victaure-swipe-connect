import { useEffect, useState } from "react";
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { SearchSuggestions } from "./SearchSuggestions";
import { SearchResultsStyle } from "./SearchResultsStyle";

interface ExternalSearchSectionProps {
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export function ExternalSearchSection({ 
  isLoading = false, 
  hasError = false, 
  errorMessage 
}: ExternalSearchSectionProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [usedSuggestions] = useState(new Set<string>());

  const fetchSuggestions = async () => {
    try {
      setIsRefreshing(true);
      setIsFetchingSuggestions(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour voir les suggestions");
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-search-suggestions', {
        body: { user_id: user.id }
      });

      if (error) throw error;
      if (data?.suggestions) {
        const newSuggestions = data.suggestions.filter(
          (suggestion: string) => !usedSuggestions.has(suggestion)
        );
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
        toast.success("Nouvelles suggestions générées!");
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error("Erreur lors de la génération des suggestions");
    } finally {
      setIsRefreshing(false);
      setIsFetchingSuggestions(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    const searchInput = document.querySelector('.gsc-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = suggestion;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      usedSuggestions.add(suggestion);
      setSuggestions(prevSuggestions => 
        prevSuggestions.filter(s => s !== suggestion)
      );

      setTimeout(() => {
        const searchButton = document.querySelector('.gsc-search-button-v2') as HTMLButtonElement;
        if (searchButton) {
          searchButton.click();
        }
      }, 100);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Card className="p-4 bg-background/60 backdrop-blur-sm border border-border/50">
        <SearchSuggestions
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          suggestions={suggestions}
          isRefreshing={isRefreshing}
          isFetchingSuggestions={isFetchingSuggestions}
          onRefresh={fetchSuggestions}
          onSuggestionClick={handleSuggestionClick}
        />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full [&_.gsc-input-box]:!bg-transparent [&_.gsc-input]:!bg-transparent relative"
        >
          <GoogleSearchBox />
          <SearchResultsStyle />
        </motion.div>
      </Card>
    </div>
  );
}