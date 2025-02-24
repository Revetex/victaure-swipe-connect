
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface GoogleSearchProps {
  searchEngineId: string;
}

export function GoogleSearch({
  searchEngineId
}: GoogleSearchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://cse.google.com/cse.js?cx=${searchEngineId}`;
    script.async = true;
    document.head.appendChild(script);
    
    // Ajouter les styles personnalisés pour la barre de recherche Google
    const style = document.createElement('style');
    style.textContent = `
      .gsc-control-cse {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
      }
      .gsc-search-box {
        margin: 0 !important;
      }
      .gsc-input-box {
        background: #1A1F2C !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 0.5rem !important;
      }
      .gsc-input {
        padding: 8px 12px !important;
        color: white !important;
      }
      input.gsc-input {
        background-color: transparent !important;
      }
      .gsc-search-button {
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
      }
      .gsc-search-button-v2 {
        background-color: #64B5D9 !important;
        border: none !important;
        padding: 8px !important;
        border-radius: 0.375rem !important;
        margin-left: 4px !important;
      }
      /* Style pour les prédictions de recherche */
      .gsc-completion-container {
        background: #1A1F2C !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 0.5rem !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
      }
      .gsc-completion-title {
        color: white !important;
      }
      .gsc-completion-selected {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
      /* Style pour le conteneur de résultats */
      .gsc-results-wrapper-overlay {
        position: fixed !important;
        top: 4rem !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: #1A1F2C !important;
        border: none !important;
        border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
        height: calc(100vh - 4rem) !important;
        max-height: none !important;
        padding: 1rem !important;
        overflow-y: auto !important;
      }
      .gsc-results-wrapper-visible {
        display: block !important;
        transform: none !important;
      }
      .gsc-modal-background-image {
        display: none !important;
      }
      .gs-result {
        background: transparent !important;
      }
      .gs-result a {
        color: #64B5D9 !important;
      }
      .gs-result .gs-snippet {
        color: rgba(255, 255, 255, 0.8) !important;
      }
      .gsc-results {
        background: transparent !important;
        width: 100% !important;
        max-width: 900px !important;
        margin: 0 auto !important;
        padding: 1rem !important;
      }
      .gsc-webResult.gsc-result {
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        background: rgba(255, 255, 255, 0.05) !important;
        margin: 8px 0 !important;
        padding: 12px !important;
        border-radius: 0.5rem !important;
        width: 100% !important;
      }
      .gsc-cursor-page {
        color: white !important;
      }
      .gsc-cursor-current-page {
        color: #64B5D9 !important;
      }
    `;
    document.head.appendChild(style);
    
    script.onerror = () => {
      console.error("Erreur lors du chargement du script Google Search");
      toast.error("Impossible de charger la recherche Google");
    };

    return () => {
      const scriptElement = document.querySelector(`script[src*="cse.js?cx=${searchEngineId}"]`);
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, [searchEngineId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Veuillez entrer un terme de recherche");
      return;
    }
    setIsLoading(true);
    const searchElement = document.querySelector('.gsc-search-box input') as HTMLInputElement;
    if (searchElement) {
      searchElement.value = query;
      const searchButton = document.querySelector('.gsc-search-button button') as HTMLButtonElement;
      searchButton?.click();
    }
    setIsLoading(false);
  };

  return (
    <Card className={cn(
      "fixed top-16 left-0 right-0 z-40",
      "bg-[#1A1F2C]/95 backdrop-blur-md",
      "border-b border-white/5",
      "shadow-lg"
    )}>
      <div className="max-w-3xl mx-auto">
        <div className="p-2">
          <div className="gcse-search" 
            data-personalizedAds="false" 
            data-mobileLayout="enabled" 
            data-resultsUrl="/jobs/search"
            data-backgroundColor="transparent"
            data-cssTheme="dark"
          />
        </div>
      </div>
    </Card>
  );
}
