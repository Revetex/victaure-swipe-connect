
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
    <section className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher dans les publications..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          aria-label="Rechercher dans les publications"
        />
      </div>
      
      <div className="flex gap-2 sm:gap-4">
        <Select
          value={filter}
          onValueChange={onFilterChange}
        >
          <SelectTrigger className="w-[140px]">
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
          <SelectTrigger className="w-[140px]">
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
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Ordre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Plus ancien</SelectItem>
            <SelectItem value="desc">Plus récent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
