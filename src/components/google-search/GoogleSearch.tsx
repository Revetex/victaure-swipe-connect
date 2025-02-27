
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
    <Card className="p-6 space-y-6">
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
