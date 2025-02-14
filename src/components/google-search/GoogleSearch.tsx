
import { useEffect } from 'react';

interface GoogleSearchProps {
  searchEngineId: string;
}

export function GoogleSearch({ searchEngineId }: GoogleSearchProps) {
  useEffect(() => {
    // Load Google Custom Search Element script
    const script = document.createElement('script');
    script.src = `https://cse.google.com/cse.js?cx=${searchEngineId}`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.head.removeChild(script);
    };
  }, [searchEngineId]);

  return (
    <div>
      {/* Google Custom Search Element will be rendered here */}
      <div className="gcse-search" />
    </div>
  );
}
