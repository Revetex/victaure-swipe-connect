import { useEffect } from 'react';
import { SearchBarStyles } from './styles/SearchBarStyles';
import { SearchResultsStyles } from './styles/SearchResultsStyles';

export function useGoogleSearchStyles() {
  useEffect(() => {
    // Create a style element
    const styleEl = document.createElement('style');
    styleEl.setAttribute('id', 'google-search-styles');
    
    // Combine all styles
    const styles = `
      ${SearchBarStyles}
      ${SearchResultsStyles}
    `;
    
    styleEl.textContent = styles;
    
    // Add styles to document head
    document.head.appendChild(styleEl);
    
    // Cleanup on unmount
    return () => {
      const existingStyle = document.getElementById('google-search-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);
}