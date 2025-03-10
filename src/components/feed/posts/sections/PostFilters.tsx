
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, RotateCcw, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/components/ThemeProvider";
import { motion } from "framer-motion";

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
  const { isDark, themeStyle } = useThemeContext();

  return (
    <motion.div 
      className={cn(
        "flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between w-full",
        "mb-5 pb-4 border-b border-white/5",
        `theme-${themeStyle}`
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Search bar with icon */}
      <div className="relative flex-1">
        <div className={cn("relative flex items-center max-w-md")}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "pl-10 pr-4 py-2 h-10 rounded-lg w-full",
              "backdrop-blur-sm border border-white/10",
              "focus:ring-1 focus:ring-primary/30 focus:border-primary/50",
              "transition-all duration-200",
              isDark ? "bg-black/20 placeholder:text-white/40" : "bg-white/10 placeholder:text-slate-400"
            )}
          />
        </div>
      </div>
      
      {/* Filters section */}
      <div className="flex gap-2 flex-wrap justify-end">
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger 
            className={cn(
              "h-10 w-[110px] backdrop-blur-sm border border-white/10",
              "focus:ring-1 focus:ring-primary/30 hover:bg-white/5",
              isDark ? "bg-black/20" : "bg-white/5"
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
              "h-10 w-[110px] backdrop-blur-sm border border-white/10",
              "focus:ring-1 focus:ring-primary/30 hover:bg-white/5",
              isDark ? "bg-black/20" : "bg-white/5"
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
              "h-10 w-[110px] backdrop-blur-sm border border-white/10",
              "focus:ring-1 focus:ring-primary/30 hover:bg-white/5",
              isDark ? "bg-black/20" : "bg-white/5"
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
          variant="outline"
          size="icon"
          className={cn(
            "h-10 w-10 backdrop-blur-sm border border-white/10",
            "hover:bg-white/10",
            isDark ? "bg-black/20" : "bg-white/5"
          )}
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
    </motion.div>
  );
}
