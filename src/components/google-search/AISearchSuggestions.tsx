import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AISearchButton } from "@/components/search/AISearchButton";
import { LoadingSkeleton } from "@/components/search/LoadingSkeleton";

interface AISearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function AISearchSuggestions({ onSuggestionClick }: AISearchSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const searchInput = document.querySelector('.gsc-input-box input') as HTMLInputElement;
      if (!searchInput?.value) return;

      const response = await fetch('/api/generate-search-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchInput.value })
      });

      if (!response.ok) throw new Error('Failed to generate suggestions');

      const data = await response.json();
      if (data.suggestions?.[0]) {
        onSuggestionClick(data.suggestions[0]);
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
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