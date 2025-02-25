
import { Search } from "lucide-react";
import { useState } from "react";

export function GoogleSearch() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="w-full bg-white dark:bg-[#1B2A4A] rounded-lg shadow-sm border border-input/20 dark:border-[#64B5D9]/10"
    >
      <div className="relative flex items-center h-14">
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher sur Google..."
          className="flex-1 h-full px-12 bg-transparent border-0 focus:outline-none focus:ring-0"
        />
      </div>
    </form>
  );
}
