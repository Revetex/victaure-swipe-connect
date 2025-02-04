import { useEffect } from 'react';

export function useGoogleSearchStyles() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .gsc-control-cse {
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
      }

      .gsc-input-box {
        border: 1px solid hsl(var(--input)) !important;
        border-radius: 0.5rem !important;
        background: transparent !important;
        padding: 4px !important;
      }

      .gsc-input {
        background: transparent !important;
        padding-inline: 8px !important;
      }

      .gsc-search-button {
        margin-left: 8px !important;
      }

      .gsc-search-button-v2 {
        padding: 8px !important;
        border-radius: 0.5rem !important;
        background-color: hsl(var(--primary)) !important;
        border: none !important;
      }

      .gsc-search-button-v2:hover {
        background-color: hsl(var(--primary-foreground)) !important;
      }

      .gsc-search-button-v2 svg {
        width: 16px !important;
        height: 16px !important;
        fill: hsl(var(--primary-foreground)) !important;
      }

      .gsc-search-button-v2:hover svg {
        fill: hsl(var(--primary)) !important;
      }

      .gsc-results-wrapper-overlay {
        background: hsl(var(--background)) !important;
        border: 1px solid hsl(var(--border)) !important;
      }

      .gsc-modal-background-image {
        background-color: rgba(0, 0, 0, 0.5) !important;
        backdrop-filter: blur(4px) !important;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
}