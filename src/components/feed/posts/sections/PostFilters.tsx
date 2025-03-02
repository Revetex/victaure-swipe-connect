
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, RotateCcw, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/components/ThemeProvider";

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
  const { isDark } = useThemeContext();

  // Couleurs adaptatives basées sur le thème
  const colors = {
    bg: isDark ? 'bg-[#1E293B]/70' : 'bg-white/90',
    border: isDark ? 'border-[#64B5D9]/20' : 'border-slate-200',
    text: isDark ? 'text-white/90' : 'text-slate-900',
    mutedText: isDark ? 'text-white/60' : 'text-slate-500',
    hover: isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100',
    placeholder: isDark ? 'placeholder:text-white/40' : 'placeholder:text-slate-400',
    primaryBg: isDark ? 'bg-[#64B5D9]/20' : 'bg-blue-50',
    primaryText: isDark ? 'text-[#64B5D9]' : 'text-blue-600',
    primaryBorder: isDark ? 'border-[#64B5D9]/30' : 'border-blue-200',
    icon: isDark ? 'text-white/70' : 'text-slate-500',
    buttonHover: isDark ? 'hover:bg-[#64B5D9]/30' : 'hover:bg-blue-100'
  };

  return (
    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between w-full">
      {/* Search bar with icon */}
      <div className="relative flex-1">
        <div className={cn("relative flex items-center max-w-md")}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "pl-10 pr-4 py-2 h-10 rounded-lg w-full bg-background/50 border-border/30",
              "focus:ring-1 focus:ring-primary/30 focus:border-primary/50",
              "transition-all duration-200",
              colors.placeholder
            )}
          />
        </div>
      </div>
      
      {/* Filters section */}
      <div className="flex gap-2 flex-wrap justify-end">
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger 
            className={cn(
              "h-10 w-[110px] bg-background/50 border-border/30",
              "focus:ring-1 focus:ring-primary/30 hover:bg-background/70"
            )}
          >
            <SelectValue placeholder="Filtrer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="my">Mes posts</SelectItem>
            <SelectItem value="friends">Amis</SelectItem>
            <SelectItem value="saved">Sauvegardés</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={onSortByChange as any}>
          <SelectTrigger 
            className={cn(
              "h-10 w-[110px] bg-background/50 border-border/30",
              "focus:ring-1 focus:ring-primary/30 hover:bg-background/70"
            )}
          >
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="likes">Likes</SelectItem>
            <SelectItem value="comments">Commentaires</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger 
            className={cn(
              "h-10 w-[110px] bg-background/50 border-border/30",
              "focus:ring-1 focus:ring-primary/30 hover:bg-background/70"
            )}
          >
            <SelectValue placeholder="Ordre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Récent</SelectItem>
            <SelectItem value="asc">Ancien</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="default"
          size="icon"
          className="h-10 w-10 bg-primary/80 hover:bg-primary text-white"
          onClick={() => {
            onFilterChange("all");
            onSortByChange("date");
            onSortOrderChange("desc");
            onSearchChange("");
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
