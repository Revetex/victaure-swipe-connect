
import { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function GoogleSearchBox() {
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
    searchDiv.setAttribute('data-as_sitesearch', 'jobs');
    searchDiv.setAttribute('data-gname', 'jobs-search');
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

  return <div ref={searchContainerRef} className="w-full" />;
}
