import { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface GoogleSearchBoxProps {
  onSearch?: () => void;
}

export function GoogleSearchBox({ onSearch }: GoogleSearchBoxProps) {
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

    // Add click event listener to search button
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const searchButton = document.querySelector('.gsc-search-button');
          if (searchButton) {
            searchButton.addEventListener('click', () => {
              if (onSearch) onSearch();
            });
            observer.disconnect();
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
      if (searchContainerRef.current) {
        searchContainerRef.current.innerHTML = '';
      }
      observer.disconnect();
    };
  }, [toast, onSearch]);

  return <div ref={searchContainerRef} className="w-full" />;
}