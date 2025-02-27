
import { Card } from "@/components/ui/card";
import { SearchBar } from "./SearchBar";
import { SearchResults } from "./SearchResults";
import { useGoogleSearch } from "./hooks/useGoogleSearch";
import { FriendsTabContent } from "@/components/feed/friends/components/FriendsTabContent";
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

      <Card className="bg-background/50 p-4">
        <h3 className="text-lg font-semibold mb-4">Mes connexions</h3>
        <FriendsTabContent currentPage={1} itemsPerPage={5} showOnlineOnly />
      </Card>
    </Card>
  );
}
