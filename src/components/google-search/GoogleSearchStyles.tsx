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

      /* Search Results Styling */
      .gsc-results-wrapper-overlay {
        background: hsl(var(--background)) !important;
        border: 1px solid hsl(var(--border)) !important;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
        border-radius: 0.5rem !important;
        padding: 1rem !important;
      }

      .gsc-modal-background-image {
        background-color: rgba(0, 0, 0, 0.5) !important;
        backdrop-filter: blur(4px) !important;
      }

      .gs-result {
        padding: 1rem !important;
        border-bottom: 1px solid hsl(var(--border)) !important;
      }

      .gs-result:last-child {
        border-bottom: none !important;
      }

      .gs-title {
        color: hsl(var(--primary)) !important;
        text-decoration: none !important;
        font-size: 1.1rem !important;
        font-weight: 500 !important;
      }

      .gs-title:hover {
        text-decoration: underline !important;
      }

      .gs-snippet {
        color: hsl(var(--foreground)) !important;
        font-size: 0.9rem !important;
        line-height: 1.5 !important;
        margin: 0.5rem 0 !important;
      }

      .gsc-url-top {
        color: hsl(var(--muted-foreground)) !important;
        font-size: 0.8rem !important;
      }

      .gsc-cursor-page {
        color: hsl(var(--primary)) !important;
        padding: 0.5rem !important;
        border-radius: 0.25rem !important;
      }

      .gsc-cursor-page:hover {
        background-color: hsl(var(--accent)) !important;
      }

      .gsc-cursor-current-page {
        background-color: hsl(var(--primary)) !important;
        color: hsl(var(--primary-foreground)) !important;
      }

      .gsc-completion-container {
        border: 1px solid hsl(var(--border)) !important;
        background: hsl(var(--background)) !important;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
        border-radius: 0.5rem !important;
      }

      .gsc-completion-selected {
        background: hsl(var(--accent)) !important;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
}