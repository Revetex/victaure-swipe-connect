import { useEffect } from 'react';

export function SearchResultsStyle() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .gsc-results-wrapper-overlay {
        background-color: hsl(var(--background)) !important;
        color: hsl(var(--foreground)) !important;
      }
      .gs-title {
        color: hsl(var(--foreground)) !important;
      }
      .gs-snippet {
        color: hsl(var(--foreground)) !important;
      }
      .gsc-input {
        font-family: var(--font-sans) !important;
      }
      .gsc-completion-container {
        background: hsl(var(--background)) !important;
        color: hsl(var(--foreground)) !important;
      }
      .gs-result {
        cursor: pointer !important;
      }
      .gs-result:hover {
        opacity: 0.8;
      }
      .gsc-results .gsc-cursor-box .gsc-cursor-page {
        color: hsl(var(--foreground)) !important;
      }
      .gsc-webResult.gsc-result {
        background-color: transparent !important;
        border: none !important;
      }
      .gsc-webResult.gsc-result:hover {
        background-color: hsl(var(--accent)) !important;
      }
    `;
    document.head.appendChild(style);

    // Add click event listener to search results
    const handleResultClick = (event: MouseEvent) => {
      const resultElement = (event.target as HTMLElement).closest('.gs-result');
      if (resultElement) {
        const titleElement = resultElement.querySelector('.gs-title');
        if (titleElement) {
          const searchText = titleElement.textContent;
          if (searchText) {
            const searchInput = document.querySelector('.gsc-input') as HTMLInputElement;
            if (searchInput) {
              searchInput.value = searchText;
              searchInput.dispatchEvent(new Event('input', { bubbles: true }));
              
              setTimeout(() => {
                const searchButton = document.querySelector('.gsc-search-button-v2') as HTMLButtonElement;
                if (searchButton) {
                  searchButton.click();
                }
              }, 100);
            }
          }
        }
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const resultsWrapper = document.querySelector('.gsc-results-wrapper-overlay');
          if (resultsWrapper) {
            resultsWrapper.addEventListener('click', handleResultClick);
          }
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.head.removeChild(style);
      observer.disconnect();
      const resultsWrapper = document.querySelector('.gsc-results-wrapper-overlay');
      if (resultsWrapper) {
        resultsWrapper.removeEventListener('click', handleResultClick);
      }
    };
  }, []);

  return null;
}