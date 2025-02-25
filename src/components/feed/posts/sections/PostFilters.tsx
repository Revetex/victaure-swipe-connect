
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PostFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  sortBy: 'date' | 'likes' | 'comments';
  onSortByChange: (value: 'date' | 'likes' | 'comments') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
}

export function PostFilters({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange
}: PostFiltersProps) {
  return (
    <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-800 p-3 space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Barre de recherche */}
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans les publications..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 bg-white/50 dark:bg-gray-800/50 h-9"
            aria-label="Rechercher dans les publications"
          />
        </div>
        
        {/* Filtres et tri */}
        <div className="flex flex-wrap gap-2">
          <Select
            value={filter}
            onValueChange={onFilterChange}
          >
            <SelectTrigger className="w-[120px] h-9 bg-white/50 dark:bg-gray-800/50">
              <SelectValue placeholder="Filtrer par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="liked">Mes favoris</SelectItem>
              <SelectItem value="following">Abonnements</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={onSortByChange}
          >
            <SelectTrigger className="w-[120px] h-9 bg-white/50 dark:bg-gray-800/50">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="likes">J'aime</SelectItem>
              <SelectItem value="comments">Commentaires</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={onSortOrderChange}
          >
            <SelectTrigger className="w-[120px] h-9 bg-white/50 dark:bg-gray-800/50">
              <SelectValue placeholder="Ordre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Plus récent</SelectItem>
              <SelectItem value="asc">Plus ancien</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
