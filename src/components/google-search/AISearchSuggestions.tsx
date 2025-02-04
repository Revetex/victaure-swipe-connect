import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface AISearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function AISearchSuggestions({ onSuggestionClick }: AISearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

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

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setCurrentQuery(suggestion);
    onSuggestionClick(suggestion);
  }, [onSuggestionClick]);

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSuggestionClick("Emplois technologie Montréal")}
          className="text-sm"
        >
          Emplois technologie Montréal
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSuggestionClick("Offres d'emploi développeur")}
          className="text-sm"
        >
          Offres d'emploi développeur
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSuggestionClick("Carrières informatique Québec")}
          className="text-sm"
        >
          Carrières informatique Québec
        </Button>
      </div>
      <Button
        variant="default"
        size="sm"
        onClick={handleSearch}
        className="ml-2"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}