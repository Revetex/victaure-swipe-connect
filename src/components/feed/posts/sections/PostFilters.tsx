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
  const {
    isDark
  } = useThemeContext();

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
  return <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between w-full">
      <div className="relative flex-1">
        <div className={cn("relative flex items-center max-w-md")}>
          
          
        </div>
      </div>
      
      
    </div>;
}