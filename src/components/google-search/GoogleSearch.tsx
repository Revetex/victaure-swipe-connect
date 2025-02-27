
import { Card } from "@/components/ui/card";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";
import { useGoogleSearch } from "./hooks/useGoogleSearch";
import "./GoogleSearchStyles.css";

export function GoogleSearch() {
  const {
    searchTerm,
    setSearchTerm,
    isSearching,
    isEnhancing,
    handleSearch,
    enhanceResults
  } = useGoogleSearch();

  return (
    <Card className="p-4 space-y-4">
      <SearchBar
        searchTerm={searchTerm}
        isSearching={isSearching}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
      />
      
      <SearchResults
        isEnhancing={isEnhancing}
        onEnhance={enhanceResults}
      />
    </Card>
  );
}
