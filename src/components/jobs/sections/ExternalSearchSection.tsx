import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { motion } from "framer-motion";

interface ExternalSearchSectionProps {
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
}

export function ExternalSearchSection({
  isLoading,
  hasError,
  onRetry,
}: ExternalSearchSectionProps) {
  const [defaultResults, setDefaultResults] = useState<boolean>(true);

  useEffect(() => {
    // Initialize Google Custom Search
    const loadGoogleSearch = () => {
      if (typeof window.google !== 'undefined') {
        // @ts-ignore
        const searchElement = google.search.cse.element.getElement('searchresults-only0');
        if (searchElement) {
          searchElement.execute('');  // Clear any existing search
          if (defaultResults) {
            // Effectuer une recherche par défaut pour les emplois à proximité
            searchElement.execute('emplois à proximité site:linkedin.com OR site:indeed.fr OR site:welcometothejungle.com');
          }
        }
      }
    };

    // Wait for Google Search to be ready
    if (typeof window.google !== 'undefined') {
      loadGoogleSearch();
    } else {
      const interval = setInterval(() => {
        if (typeof window.google !== 'undefined') {
          loadGoogleSearch();
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [defaultResults]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">
            Chargement des résultats...
          </span>
        </motion.div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <p className="text-sm text-muted-foreground">
          Une erreur est survenue lors du chargement des résultats.
        </p>
        <Button onClick={onRetry} variant="outline" size="sm">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="gcse-searchbox-only" data-resultsUrl="/search"></div>
      <div 
        className="gcse-searchresults-only" 
        data-maxResults="5"
        data-refinementStyle="link"
      ></div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .gsc-control-cse {
          font-family: inherit !important;
          border: none !important;
          background-color: transparent !important;
          padding: 0 !important;
          width: 100% !important;
        }
        
        .gsc-input-box {
          border-radius: 0.375rem !important;
          border: 1px solid hsl(var(--input)) !important;
          background-color: hsl(var(--background)) !important;
          width: 100% !important;
        }

        .gsc-input-box input {
          background-color: transparent !important;
          color: hsl(var(--foreground)) !important;
        }

        .gsc-search-button {
          display: none !important;
        }

        .gsc-results-wrapper-overlay {
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
        }

        .gs-result {
          border-color: hsl(var(--border)) !important;
        }

        .gs-result a {
          color: hsl(var(--foreground)) !important;
        }

        .gs-result .gs-snippet {
          color: hsl(var(--muted-foreground)) !important;
        }

        .gsc-above-wrapper-area,
        .gsc-table-result,
        .gsc-thumbnail-inside,
        .gsc-url-top {
          border: none !important;
          background-color: transparent !important;
        }

        .gcsc-find-more-on-google {
          display: none !important;
        }

        .gcsc-more-maybe-branding-root {
          display: none !important;
        }
        `
      }} />
    </div>
  );
}