
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, RotateCcw, Search } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <section className="backdrop-blur-md rounded-xl shadow-lg bg-primary/5 py-3 px-4 border border-primary/10">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60" />
          <Input 
            type="search" 
            placeholder="Rechercher..." 
            value={searchTerm} 
            onChange={e => onSearchChange(e.target.value)} 
            className={cn(
              "w-full pl-9",
              "bg-white/5 border-white/10 text-white/90",
              "placeholder:text-white/40 focus:bg-white/10",
              "transition-colors duration-200 rounded-lg"
            )}
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <Select value={filter} onValueChange={onFilterChange}>
            <SelectTrigger className={cn(
              "w-[130px]",
              "bg-white/5 border-white/10 text-white/90",
              "hover:bg-white/10 focus:bg-white/10",
              "rounded-lg transition-colors duration-200"
            )}>
              <Filter className="mr-2 h-4 w-4 text-primary/80" />
              <SelectValue placeholder="Filtrer par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="friends">Amis</SelectItem>
              <SelectItem value="my">Mes posts</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className={cn(
              "w-[130px]",
              "bg-white/5 border-white/10 text-white/90",
              "hover:bg-white/10 focus:bg-white/10",
              "rounded-lg transition-colors duration-200"
            )}>
              <RotateCcw className="mr-2 h-4 w-4 text-primary/80" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="likes">J'aimes</SelectItem>
              <SelectItem value="comments">Commentaires</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={onSortOrderChange}>
            <SelectTrigger className={cn(
              "w-[130px]",
              "bg-white/5 border-white/10 text-white/90",
              "hover:bg-white/10 focus:bg-white/10",
              "rounded-lg transition-colors duration-200"
            )}>
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
