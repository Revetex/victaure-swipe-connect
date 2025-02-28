
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface PostFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
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
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher dans les posts..."
          className="pl-8 bg-background/50"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex flex-1 gap-2">
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full bg-background/50">
            <SelectValue placeholder="Tous les posts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les posts</SelectItem>
            <SelectItem value="following">Mes connexions</SelectItem>
            <SelectItem value="my-posts">Mes posts</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-full bg-background/50">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Date</SelectItem>
            <SelectItem value="likes">Likes</SelectItem>
            <SelectItem value="comments">Commentaires</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortOrder} onValueChange={(value) => onSortOrderChange(value as "asc" | "desc")}>
          <SelectTrigger className="w-[100px] bg-background/50">
            <SelectValue placeholder="Ordre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Plus récent</SelectItem>
            <SelectItem value="asc">Plus ancien</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={onCreatePost} className="whitespace-nowrap">
        Créer un post
      </Button>
    </div>
  );
}
