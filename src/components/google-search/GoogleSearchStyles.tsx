import { useEffect } from 'react';
import { SearchBarStyles } from './styles/SearchBarStyles';
import { SearchResultsStyles } from './styles/SearchResultsStyles';

export function useGoogleSearchStyles() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .gsc-control-cse {
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
      }

      ${SearchBarStyles}
      ${SearchResultsStyles}
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
}