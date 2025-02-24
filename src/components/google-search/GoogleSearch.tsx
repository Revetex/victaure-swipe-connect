
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface GoogleSearchProps {
  searchEngineId: string;
}

export function GoogleSearch({ searchEngineId }: GoogleSearchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Load Google Custom Search Element script
    const script = document.createElement('script');
    script.src = `https://cse.google.com/cse.js?cx=${searchEngineId}`;
    script.async = true;
    document.head.appendChild(script);

    script.onerror = () => {
      console.error("Erreur lors du chargement du script Google Search");
      toast.error("Impossible de charger la recherche Google");
    };

    return () => {
      // Cleanup script when component unmounts
      const scriptElement = document.querySelector(`script[src*="cse.js?cx=${searchEngineId}"]`);
      if (scriptElement) {
        document.head.removeChild(scriptElement);
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
    
    // Trigger search using Google CSE API
    const searchElement = document.querySelector('.gsc-search-box input') as HTMLInputElement;
    if (searchElement) {
      searchElement.value = query;
      const searchButton = document.querySelector('.gsc-search-button button') as HTMLButtonElement;
      searchButton?.click();
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          type="search"
          placeholder="Rechercher des offres d'emploi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </form>

      <div className="gcse-search" 
        data-personalizedAds="false"
        data-mobileLayout="enabled"
        data-resultsUrl="/jobs/search"
      />
    </Card>
  );
}
