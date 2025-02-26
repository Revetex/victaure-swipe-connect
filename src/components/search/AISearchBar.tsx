
import { useState, useEffect } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AISearchBarProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
  className?: string;
  placeholder?: string;
}

export function AISearchBar({ 
  onSearch, 
  isSearching = false, 
  className,
  placeholder = "Rechercher avec l'IA..." 
}: AISearchBarProps) {
  const [query, setQuery] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isSearching) {
      setIsAnimating(true);
    } else {
      const timeout = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isSearching]);

  const handleSearch = () => {
    if (!query.trim()) {
      toast.error("Veuillez entrer un terme de recherche");
      return;
    }
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={cn(
      "relative flex items-center gap-2",
      "w-full max-w-2xl mx-auto",
      className
    )}>
      <div className="relative flex-1">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-4 h-12",
            "bg-background/50 dark:bg-background/30",
            "border border-border/50 dark:border-border/20",
            "rounded-xl shadow-sm",
            "backdrop-blur-sm",
            "transition-all duration-200",
            "focus:ring-2 focus:ring-primary/20",
            "placeholder:text-muted-foreground/70"
          )}
          disabled={isSearching}
        />
        <Search 
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
            "text-muted-foreground/70",
            isSearching ? "animate-pulse" : ""
          )} 
        />
      </div>

      <Button
        onClick={handleSearch}
        disabled={isSearching || !query.trim()}
        className={cn(
          "h-12 px-4",
          "bg-primary dark:bg-primary/90",
          "hover:bg-primary/90 dark:hover:bg-primary/80",
          "text-primary-foreground",
          "rounded-xl",
          "transition-all duration-200",
          "disabled:opacity-50"
        )}
      >
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="searching"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Recherche...</span>
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Rechercher</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
}
