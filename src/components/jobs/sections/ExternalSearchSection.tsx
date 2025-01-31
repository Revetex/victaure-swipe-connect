import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface ExternalSearchSectionProps {
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
}

export function ExternalSearchSection({ isLoading, hasError, onRetry }: ExternalSearchSectionProps) {
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=1262c5460a0314a80";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.search.cse.element.render({
          div: searchContainerRef.current,
          tag: 'search',
          gname: 'gsearch',
        });
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="relative">
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
            <div ref={searchContainerRef} className="gcse-search"></div>
          </motion.div>
        )}
      </div>
    </div>
  );
}