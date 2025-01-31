import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ExternalSearchSectionProps {
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
}

export function ExternalSearchSection({ isLoading, hasError, onRetry }: ExternalSearchSectionProps) {
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    // Disable all Google CSE logging and analytics before loading the script
    window.___gcfg = {
      parsetags: 'explicit',
      suppressAnalytics: true,
      suppressLogging: true
    };

    // Create and configure script element with error handling
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=1262c5460a0314a80";
    script.async = true;
    
    const handleError = () => {
      setScriptError(true);
      console.error("Failed to load Google CSE script");
    };

    script.onerror = handleError;

    script.onload = () => {
      try {
        if (window.google && searchContainerRef.current) {
          window.google.search.cse.element.render({
            div: searchContainerRef.current,
            tag: 'search',
            gname: 'gsearch',
            attributes: {
              enableHistory: 'false',
              enableOrderBy: 'false',
              enableLogging: 'false',
              enableAnalytics: 'false',
              noResultsString: 'Aucun résultat trouvé',
              newWindow: 'true',
              queryParameterName: 'q'
            }
          });
        }
      } catch (error) {
        console.error("Error rendering Google CSE:", error);
        setScriptError(true);
      }
    };

    // Add the script to the document
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        script.remove();
      }
      // Clean up the global configuration
      delete window.___gcfg;
      // Clean up any existing CSE elements
      const existingElements = document.querySelectorAll('.gcse-search');
      existingElements.forEach(element => element.remove());
    };
  }, []);

  if (scriptError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[100px]">
        <Search className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground">Une erreur est survenue lors du chargement de la recherche</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full">
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
            className="flex flex-col gap-4 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div ref={searchContainerRef} className="w-full gcse-search"></div>
          </motion.div>
        )}
      </div>
    </div>
  );
}