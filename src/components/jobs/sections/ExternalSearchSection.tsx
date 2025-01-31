import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ExternalSearchSectionProps {
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
}

export function ExternalSearchSection({ isLoading, hasError, onRetry }: ExternalSearchSectionProps) {
  const { toast } = useToast();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!searchContainerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://cse.google.com/cse.js?cx=1262c5460a0314a80';
    script.async = true;
    scriptRef.current = script;

    const searchDiv = document.createElement('div');
    searchDiv.className = 'gcse-search';
    searchContainerRef.current.innerHTML = '';
    searchContainerRef.current.appendChild(searchDiv);

    document.head.appendChild(script);

    script.onerror = () => {
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: "Impossible de charger le moteur de recherche. Veuillez réessayer."
      });
    };

    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
      if (searchContainerRef.current) {
        searchContainerRef.current.innerHTML = '';
      }
    };
  }, [toast]);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[200px] p-4 border border-destructive/50 rounded-lg">
        <Search className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground text-center">
          Une erreur est survenue lors du chargement de la recherche
        </p>
        <Button onClick={onRetry} variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[200px] p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement de la recherche...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full min-h-[100px] bg-background rounded-lg p-4 sm:p-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full"
        >
          <div ref={searchContainerRef} className="w-full h-full" />
        </motion.div>
      </div>
      
      <p className="text-sm text-muted-foreground text-center italic">
        Conseil : Essayez des mots-clés comme "construction", "comptable" ou une ville (ex: "Alma") pour trouver des offres pertinentes
      </p>
    </div>
  );
}