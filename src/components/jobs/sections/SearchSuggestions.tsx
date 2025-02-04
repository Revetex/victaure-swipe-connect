import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchSuggestionsProps {
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  suggestions: string[];
  isRefreshing: boolean;
  isFetchingSuggestions: boolean;
  onRefresh: () => void;
  onSuggestionClick: (suggestion: string) => void;
}

export function SearchSuggestions({
  showSuggestions,
  setShowSuggestions,
  suggestions,
  isRefreshing,
  isFetchingSuggestions,
  onRefresh,
  onSuggestionClick,
}: SearchSuggestionsProps) {
  return (
    <div className="mb-4">
      <Button
        variant="outline"
        size="lg"
        onClick={() => setShowSuggestions(!showSuggestions)}
        className="w-full relative group transition-all duration-300 bg-background/80 hover:bg-background/90 border border-border/50 shadow-sm hover:shadow-md"
      >
        <div className="absolute -left-2 top-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
          >
            <Sparkles className="w-5 h-5 text-blue-500" />
          </motion.div>
        </div>
        <span className="flex items-center gap-2 text-foreground/80">
          Suggestions IA personnalisées
          {showSuggestions ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
        <motion.div
          className="absolute -right-2 top-1/2 -translate-y-1/2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onRefresh();
            }}
            disabled={isRefreshing}
            className="h-8 w-8 rounded-full bg-blue-500/10 hover:bg-blue-500/20"
          >
            <RefreshCw className={`h-4 w-4 text-blue-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </motion.div>
      </Button>

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-4"
          >
            <div className="space-y-2">
              {isFetchingSuggestions ? (
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-8 w-36" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => onSuggestionClick(suggestion)}
                      className="text-sm px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-200 border border-primary/20 hover:border-primary/30"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}