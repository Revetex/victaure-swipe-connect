export function useSearchResultsStyles() {
  return `
    .gsc-results-wrapper-overlay {
      background: hsl(var(--background)) !important;
      border: 1px solid hsl(var(--border)) !important;
      box-shadow: 0 4px 24px -4px rgba(0, 0, 0, 0.1) !important;
      border-radius: 1rem !important;
      padding: 1.5rem !important;
      max-width: 800px !important;
      margin: 2rem auto !important;
    }

    .gsc-modal-background-image {
      background-color: rgba(0, 0, 0, 0.5) !important;
      backdrop-filter: blur(4px) !important;
    }

    .gs-result {
      padding: 1.25rem !important;
      margin: 0.75rem 0 !important;
      border: 1px solid hsl(var(--border)) !important;
      border-radius: 0.75rem !important;
      transition: all 0.2s ease !important;
      background: hsl(var(--background)) !important;
    }

    .gs-result:hover {
      border-color: hsl(var(--primary)/0.5) !important;
      background: hsl(var(--accent)/0.1) !important;
    }

    .gs-title:not(.gsc-table-cell-thumbnail) {
      color: hsl(var(--primary)) !important;
      text-decoration: none !important;
      font-size: 1.1rem !important;
      font-weight: 600 !important;
      margin-bottom: 0.5rem !important;
      display: block !important;
    }

    .gs-title:hover {
      text-decoration: underline !important;
    }

    .gsc-table-cell-thumbnail {
      display: none !important;
    }

    .gs-snippet {
      color: hsl(var(--foreground)) !important;
      font-size: 0.95rem !important;
      line-height: 1.6 !important;
      margin: 0.75rem 0 !important;
    }

    .gsc-url-top {
      color: hsl(var(--muted-foreground)) !important;
      font-size: 0.85rem !important;
      margin-top: 0.5rem !important;
    }

    .gsc-cursor-page {
      color: hsl(var(--primary)) !important;
      padding: 0.5rem 0.75rem !important;
      border-radius: 0.5rem !important;
      margin: 0 0.25rem !important;
      transition: all 0.2s ease !important;
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
      box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1) !important;
      border-radius: 0.75rem !important;
      padding: 0.5rem !important;
      margin-top: 0.5rem !important;
      font-family: inherit !important;
      text-transform: none !important;
    }

    .gsc-completion-selected {
      background: hsl(var(--accent)) !important;
      border-radius: 0.5rem !important;
    }

    .gcsc-more-maybe-branding-root {
      display: none !important;
    }

    .gsc-search-button {
      display: none !important;
    }
  `;
}