import { useEffect } from 'react';
import { useSearchBarStyles } from './styles/SearchBarStyles';
import { useSearchResultsStyles } from './styles/SearchResultsStyles';

export function useGoogleSearchStyles() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .gsc-control-cse {
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
      }

      ${useSearchBarStyles()}
      ${useSearchResultsStyles()}
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
}