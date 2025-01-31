import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ExternalSearchSectionProps {
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
}

export function ExternalSearchSection({ isLoading, hasError, onRetry }: ExternalSearchSectionProps) {
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [scriptError, setScriptError] = useState(false);
  const [isSearchLoaded, setIsSearchLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadSearch = () => {
      if (!window.google?.search?.cse?.element) {
        console.error("Google CSE not found");
        setScriptError(true);
        return;
      }

      try {
        const searchDiv = document.createElement('div');
        searchDiv.className = 'gcse-search';
        searchDiv.setAttribute('data-gname', 'gsearch');
        searchDiv.setAttribute('enableAutoComplete', 'true');
        
        if (searchContainerRef.current) {
          searchContainerRef.current.innerHTML = '';
          searchContainerRef.current.appendChild(searchDiv);
        }

        window.google.search.cse.element.render({
          div: searchDiv,
          tag: 'search',
          gname: 'gsearch'
        });

        setIsSearchLoaded(true);
        setScriptError(false);
      } catch (error) {
        console.error("Error rendering search:", error);
        setScriptError(true);
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger la recherche. Veuillez réessayer."
        });
      }
    };

    const loadScript = () => {
      const existingScript = document.querySelector('script[src*="cse.google.com"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.src = 'https://cse.google.com/cse.js?cx=1262c5460a0314a80';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google?.search?.cse?.element) {
          loadSearch();
        } else {
          const checkGoogleCSE = setInterval(() => {
            if (window.google?.search?.cse?.element) {
              loadSearch();
              clearInterval(checkGoogleCSE);
            }
          }, 100);

          setTimeout(() => {
            clearInterval(checkGoogleCSE);
            if (!isSearchLoaded) {
              setScriptError(true);
              toast({
                variant: "destructive",
                title: "Erreur de chargement",
                description: "Le service de recherche n'a pas pu être chargé. Veuillez réessayer plus tard."
              });
            }
          }, 10000); // Increased timeout to 10s
        }
      };
      
      script.onerror = () => {
        console.error("Failed to load Google CSE script");
        setScriptError(true);
        toast({
          variant: "destructive",
          title: "Erreur de chargement",
          description: "Impossible de charger le script de recherche. Veuillez vérifier votre connexion."
        });
      };
      
      document.head.appendChild(script);
    };

    loadScript();

    return () => {
      const existingScript = document.querySelector('script[src*="cse.google.com"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [toast]);

  if (scriptError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[200px] p-4 border border-destructive/50 rounded-lg">
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
    <div className="relative w-full min-h-[400px] bg-background rounded-lg p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full"
      >
        <div ref={searchContainerRef} className="w-full h-full" />
      </motion.div>
    </div>
  );
}