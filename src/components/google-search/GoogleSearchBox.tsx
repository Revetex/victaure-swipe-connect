import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchSuggestions } from "./SearchSuggestions";

export function GoogleSearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(searchUrl, "_blank");
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher sur Google..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowSuggestions(true)}
          className="shrink-0"
        >
          <Sparkles className="h-4 w-4" />
        </Button>
        
        <Button type="submit" className="shrink-0">
          Rechercher
        </Button>
      </form>

      <SearchSuggestions
        isOpen={showSuggestions}
        onSelect={handleSuggestionSelect}
        onClose={() => setShowSuggestions(false)}
      />
    </div>
  );
}