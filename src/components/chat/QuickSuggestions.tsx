
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickSuggestionsProps {
  suggestions: string[];
  isLoading: boolean;
  onSelect: (suggestion: string) => void;
  className?: string;
}

export function QuickSuggestions({
  suggestions,
  isLoading,
  onSelect,
  className
}: QuickSuggestionsProps) {
  if (suggestions.length === 0 && !isLoading) return null;

  return (
    <div className={cn("w-full space-y-2", className)}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center p-2"
          >
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          </motion.div>
        ) : (
          <motion.div
            key="suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap gap-2"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelect(suggestion)}
                  className={cn(
                    "bg-background/50 dark:bg-background/30",
                    "hover:bg-background/70 dark:hover:bg-background/40",
                    "border border-border/50 dark:border-border/20",
                    "text-sm text-muted-foreground",
                    "transition-all duration-200"
                  )}
                >
                  {suggestion}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
