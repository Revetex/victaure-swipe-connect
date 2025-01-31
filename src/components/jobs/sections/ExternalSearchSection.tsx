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
  const [isSearchLoaded, setIsSearchLoaded] = useState(false);

  useEffect(() => {
    const loadSearch = () => {
      if (window.google?.search?.cse?.element) {
        try {
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
              queryParameterName: 'q',
              resultsUrl: window.location.origin + window.location.pathname,
              linkTarget: '_blank'
            }
          });
          
          // Set search as loaded after rendering
          setIsSearchLoaded(true);
          setScriptError(false);
        } catch (error) {
          console.error("Error rendering search:", error);
          setScriptError(true);
        }
      }
    };

    // Cleanup function to remove existing elements
    const cleanup = () => {
      const existingElements = document.querySelectorAll('.gcse-search, script[src*="cse.google.com"]');
      existingElements.forEach(element => element.remove());
      document.body.classList.remove('gsc-overflow-hidden');
    };

    // Load Google CSE script
    const loadScript = () => {
      cleanup();
      
      const script = document.createElement('script');
      script.src = 'https://cse.google.com/cse.js?cx=1262c5460a0314a80';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google?.search?.cse?.element) {
          loadSearch();
        }
      };
      
      script.onerror = () => {
        console.error("Failed to load Google CSE script");
        setScriptError(true);
      };
      
      document.head.appendChild(script);
    };

    loadScript();

    return cleanup;
  }, []);

  if (scriptError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[200px] p-4">
        <Search className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground text-center">
          Une erreur est survenue lors du chargement de la recherche
        </p>
        <Button 
          onClick={() => {
            setScriptError(false);
            setIsSearchLoaded(false);
            window.location.reload();
          }} 
          variant="outline"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  if (!isSearchLoaded) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[200px] p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement de la recherche...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[400px]">
      <div className="flex flex-col gap-4">
        <motion.div 
          className="flex flex-col gap-4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div ref={searchContainerRef} className="w-full gcse-search"></div>
        </motion.div>
      </div>
    </div>
  );
}