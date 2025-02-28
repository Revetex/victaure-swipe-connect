
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

export interface PostFiltersProps {
  searchTerm: string;
  onSearchChange: (search: string) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
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
}: PostFiltersProps) {
  return (
    <Card className="p-3 bg-card/50 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <Input
            placeholder="Rechercher un post..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-transparent border-input/20"
          />
        </div>
        
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px] bg-transparent border-input/20">
            <SelectValue placeholder="Filtrer par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les posts</SelectItem>
            <SelectItem value="my">Mes posts</SelectItem>
            <SelectItem value="friends">Amis uniquement</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-[180px] bg-transparent border-input/20">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="likes">Likes</SelectItem>
            <SelectItem value="comments">Commentaires</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={sortOrder} 
          onValueChange={(value) => onSortOrderChange(value as 'asc' | 'desc')}
        >
          <SelectTrigger className="w-[180px] bg-transparent border-input/20">
            <SelectValue placeholder="Ordre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Décroissant</SelectItem>
            <SelectItem value="asc">Croissant</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={onCreatePost}
          className="bg-primary/90 hover:bg-primary text-white"
        >
          Créer un post
        </Button>
      </div>
    </Card>
  );
}
