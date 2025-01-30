import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ExternalSearchSectionProps {
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
}

export function ExternalSearchSection({ isLoading, hasError, onRetry }: ExternalSearchSectionProps) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">Recherche externe</h3>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 min-h-[200px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de la recherche externe...</p>
        </div>
      ) : hasError ? (
        <div className="flex flex-col items-center justify-center gap-4 min-h-[200px]">
          <Search className="h-12 w-12 text-destructive" />
          <p className="text-muted-foreground">Une erreur est survenue lors du chargement de la recherche</p>
          <Button onClick={onRetry} variant="outline">
            Réessayer
          </Button>
        </div>
      ) : (
        <motion.div 
          className="google-search-container min-h-[400px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Google Custom Search elements will be injected here */}
        </motion.div>
      )}
    </div>
  );
}