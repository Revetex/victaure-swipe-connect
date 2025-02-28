
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Dispatch, SetStateAction, ReactNode } from "react";

export interface PostFiltersProps {
  searchTerm: string;
  onSearchChange: (search: string) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
  sortBy: "likes" | "comments" | "date";
  onSortByChange: Dispatch<SetStateAction<"likes" | "comments" | "date">>;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
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
}: PostFiltersProps): ReactNode {
  return (
    <Card className="p-4 bg-black/40 backdrop-blur-sm border-zinc-800/50">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des posts..."
              className="pl-8 bg-background/50"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button onClick={onCreatePost} size="sm" variant="default">
            Créer
          </Button>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Select value={filter} onValueChange={onFilterChange}>
            <SelectTrigger className="w-[140px] bg-background/50">
              <SelectValue placeholder="Filtrer par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="mine">Mes posts</SelectItem>
              <SelectItem value="friends">Amis</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={sortBy} 
            onValueChange={(value) => onSortByChange(value as "likes" | "comments" | "date")}
          >
            <SelectTrigger className="w-[140px] bg-background/50">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="likes">J'aime</SelectItem>
              <SelectItem value="comments">Commentaires</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOrder} onValueChange={onSortOrderChange}>
            <SelectTrigger className="w-[140px] bg-background/50">
              <SelectValue placeholder="Ordre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Décroissant</SelectItem>
              <SelectItem value="asc">Croissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
