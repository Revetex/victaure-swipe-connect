
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'job' | 'profile' | 'post' | 'service';
  relevanceScore: number;
  metadata?: Record<string, any>;
}

interface AISearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

export function AISearchResults({ 
  results, 
  isLoading,
  onResultClick,
  className 
}: AISearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 w-full max-w-2xl mx-auto">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className={cn(
              "p-4 animate-pulse",
              "bg-background/50 dark:bg-background/30",
              "border border-border/50 dark:border-border/20"
            )}
          >
            <div className="h-4 w-2/3 bg-muted rounded" />
            <div className="h-3 w-full bg-muted rounded mt-3" />
            <div className="h-3 w-4/5 bg-muted rounded mt-2" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className={cn("space-y-4 w-full max-w-2xl mx-auto", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {results.map((result) => (
        <motion.div
          key={result.id}
          layoutId={result.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            onClick={() => onResultClick?.(result)}
            className={cn(
              "p-4 cursor-pointer",
              "bg-background/50 dark:bg-background/30",
              "hover:bg-background/70 dark:hover:bg-background/40",
              "border border-border/50 dark:border-border/20",
              "transition-all duration-200"
            )}
          >
            <h3 className="text-lg font-medium mb-2">{result.title}</h3>
            <p className="text-sm text-muted-foreground">{result.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                {result.type}
              </span>
              <span className="text-xs text-muted-foreground">
                Score: {(result.relevanceScore * 100).toFixed(0)}%
              </span>
            </div>
          </Card>
        </motion.div>
      ))}

      {results.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-muted-foreground py-8"
        >
          Aucun résultat trouvé
        </motion.div>
      )}
    </motion.div>
  );
}
