import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface ExternalSearchSectionProps {
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
}

export function ExternalSearchSection({ isLoading, hasError, onRetry }: ExternalSearchSectionProps) {
  useEffect(() => {
    // Load Google Custom Search script
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=1262c5460a0314a80";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 min-h-[100px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Chargement de la recherche externe...</p>
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center gap-4 min-h-[100px]">
            <Search className="h-12 w-12 text-destructive" />
            <p className="text-muted-foreground">Une erreur est survenue lors du chargement de la recherche</p>
            <Button onClick={onRetry} variant="outline">
              Réessayer
            </Button>
          </div>
        ) : (
          <motion.div 
            className="flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="gcse-search" data-linktarget="_self"></div>
          </motion.div>
        )}
      </div>
    </div>
  );
}