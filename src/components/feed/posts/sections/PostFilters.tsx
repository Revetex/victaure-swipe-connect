
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RotateCcw, Search } from "lucide-react";

interface PostFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  sortBy: 'date' | 'likes' | 'comments';
  onSortByChange: (value: 'date' | 'likes' | 'comments') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  onCreatePost: () => void;
}

export function PostFilters({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onCreatePost
}: PostFiltersProps) {
  return (
    <section className="bg-card/30 dark:bg-card/20 backdrop-blur-md border border-border/10 rounded-xl shadow-lg px-4 py-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 bg-background/50 dark:bg-background/20 border-border/10 
                     focus:bg-background/80 dark:focus:bg-background/40
                     transition-colors duration-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={onFilterChange}>
            <SelectTrigger className="w-[130px] bg-background/50 dark:bg-background/20 border-border/10">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrer par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="friends">Amis</SelectItem>
              <SelectItem value="my">Mes posts</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-[130px] bg-background/50 dark:bg-background/20 border-border/10">
              <RotateCcw className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="likes">J'aimes</SelectItem>
              <SelectItem value="comments">Commentaires</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={onSortOrderChange}>
            <SelectTrigger className="w-[130px] bg-background/50 dark:bg-background/20 border-border/10">
              <SelectValue placeholder="Ordre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Décroissant</SelectItem>
              <SelectItem value="asc">Croissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
