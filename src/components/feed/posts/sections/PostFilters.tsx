
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SortAsc, SortDesc, Plus } from "lucide-react";

interface PostFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  sortBy: 'date' | 'likes' | 'comments';
  onSortByChange: (value: 'date' | 'likes' | 'comments') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  onCreatePost?: () => void;
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
    <section className="bg-[#1B2A4A]/40 backdrop-blur-md border border-[#64B5D9]/10 rounded-xl shadow-lg p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="flex-shrink-0 bg-[#1A1F2C] text-[#F2EBE4] hover:text-[#F2EBE4]/80 hover:bg-white/5 border-white/10"
          onClick={onCreatePost}
        >
          <Plus className="h-4 w-4 mr-2" />
          Créer une publication
        </Button>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Rechercher dans les publications..." 
            value={searchTerm} 
            onChange={e => onSearchChange(e.target.value)} 
            className="pl-9 bg-[#1A1F2C]/60 border-white/10 text-white/90 placeholder:text-white/40"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="min-w-[140px] bg-[#1A1F2C]/60 border-white/10 text-white/90">
            <SelectValue placeholder="Filtrer par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les posts</SelectItem>
            <SelectItem value="my">Mes posts</SelectItem>
            <SelectItem value="liked">Posts aimés</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="min-w-[140px] bg-[#1A1F2C]/60 border-white/10 text-white/90">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="likes">Likes</SelectItem>
            <SelectItem value="comments">Commentaires</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')} 
          className="shrink-0 bg-[#1A1F2C]/60 border-white/10 text-white/90 hover:bg-white/5"
        >
          {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </Button>
      </div>
    </section>
  );
}
