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
    script.onerror = () => {
      console.error("Erreur lors du chargement du script Google Search");
      toast.error("Impossible de charger la recherche Google");
    };
    return () => {
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
    const searchElement = document.querySelector('.gsc-search-box input') as HTMLInputElement;
    if (searchElement) {
      searchElement.value = query;
      const searchButton = document.querySelector('.gsc-search-button button') as HTMLButtonElement;
      searchButton?.click();
    }
    setIsLoading(false);
  };
  return <Card className="w-full bg-[#1A1F2C] border-2 border-white/10 shadow-xl">
      <div className="p-4 space-y-4">
        

        <div className="gcse-search" data-personalizedAds="false" data-mobileLayout="enabled" data-resultsUrl="/jobs/search" />
      </div>
    </Card>;
}