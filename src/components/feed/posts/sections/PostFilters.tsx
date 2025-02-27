
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
    buttonHover: isDark ? 'hover:bg-[#64B5D9]/30' : 'hover:bg-blue-100',
  };

  return (
    <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between w-full">
      <div className="relative flex-1">
        <div className={cn(
          "relative flex items-center max-w-md",
        )}>
          <Search className={cn("absolute left-3 h-4 w-4", colors.icon)} />
          <Input
            placeholder="Rechercher..."
            className={cn(
              "pl-9 h-9 rounded-lg",
              colors.bg,
              colors.border,
              colors.text,
              colors.placeholder,
              "transition-colors duration-200",
              "focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[#64B5D9]/50",
              isDark ? "shadow-inner" : ""
            )}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger 
            className={cn(
              "h-9 w-[130px] rounded-lg",
              colors.bg,
              colors.border,
              colors.text,
              "focus:ring-1 focus:ring-offset-0 focus:ring-[#64B5D9]/50",
              isDark ? "shadow-inner" : ""
            )}
          >
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Tous" />
            </div>
          </SelectTrigger>
          <SelectContent
            className={cn(
              "rounded-lg",
              colors.bg,
              colors.border,
              "backdrop-blur-lg"
            )}
          >
            <SelectItem value="all">
              <span className={colors.text}>Tous</span>
            </SelectItem>
            <SelectItem value="my_posts">
              <span className={colors.text}>Mes posts</span>
            </SelectItem>
            <SelectItem value="following">
              <span className={colors.text}>Suivis</span>
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={onSortByChange as (value: string) => void}>
          <SelectTrigger 
            className={cn(
              "h-9 w-[130px] rounded-lg",
              colors.bg,
              colors.border,
              colors.text,
              "focus:ring-1 focus:ring-offset-0 focus:ring-[#64B5D9]/50",
              isDark ? "shadow-inner" : ""
            )}
          >
            <SelectValue placeholder="Récent" />
          </SelectTrigger>
          <SelectContent
            className={cn(
              "rounded-lg",
              colors.bg,
              colors.border,
              "backdrop-blur-lg"
            )}
          >
            <SelectItem value="date">
              <span className={colors.text}>Date</span>
            </SelectItem>
            <SelectItem value="likes">
              <span className={colors.text}>Likes</span>
            </SelectItem>
            <SelectItem value="comments">
              <span className={colors.text}>Commentaires</span>
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortOrder} onValueChange={onSortOrderChange as (value: string) => void}>
          <SelectTrigger 
            className={cn(
              "h-9 w-[100px] rounded-lg",
              colors.bg,
              colors.border,
              colors.text,
              "focus:ring-1 focus:ring-offset-0 focus:ring-[#64B5D9]/50",
              isDark ? "shadow-inner" : ""
            )}
          >
            <SelectValue placeholder="Desc" />
          </SelectTrigger>
          <SelectContent
            className={cn(
              "rounded-lg",
              colors.bg,
              colors.border,
              "backdrop-blur-lg"
            )}
          >
            <SelectItem value="desc">
              <span className={colors.text}>Desc</span>
            </SelectItem>
            <SelectItem value="asc">
              <span className={colors.text}>Asc</span>
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-9 w-9 rounded-lg",
            colors.bg,
            colors.border,
            colors.icon,
            colors.buttonHover
          )}
          title="Rafraîchir"
          onClick={() => {
            onSearchChange('');
            onFilterChange('all');
            onSortByChange('date');
            onSortOrderChange('desc');
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button 
          size="sm" 
          className={cn(
            "h-9 gap-2 rounded-lg hidden sm:flex",
            isDark 
              ? "bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          )}
          onClick={onCreatePost}
        >
          <Plus className="h-4 w-4" />
          Nouveau post
        </Button>
      </div>
    </div>
  );
}
