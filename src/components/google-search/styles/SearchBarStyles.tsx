
export const SearchBarStyles = `
  .gsc-control-cse {
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
  }

  .gsc-search-box {
    margin: 0 !important;
    background: transparent !important;
  }

  .gsc-input-box {
    border: 1px solid hsl(var(--border)) !important;
    border-radius: 0.5rem !important;
    background: hsl(var(--background)) !important;
    padding: 0.5rem !important;
  }

  .gsc-input {
    padding: 0 !important;
    width: 100% !important;
    font-family: inherit !important;
    text-transform: none !important;
  }

  .gsc-completion-container {
    font-family: inherit !important;
    text-transform: none !important;
    background: hsl(var(--background)) !important;
    border: 1px solid hsl(var(--border)) !important;
    border-radius: 0.5rem !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    margin-top: 4px !important;
  }

  .gsc-completion-selected {
    background: hsl(var(--accent)) !important;
  }

  .gsc-search-button {
    display: none !important;
  }

  .gsc-results-wrapper-overlay {
    background: hsl(var(--background)) !important;
  }

  .gsc-webResult.gsc-result {
    border: none !important;
    padding: 1rem !important;
    margin-bottom: 1rem !important;
    background: transparent !important;
  }

  .gs-title {
    color: hsl(var(--primary)) !important;
    text-decoration: none !important;
  }

  .gs-snippet {
    color: hsl(var(--foreground)) !important;
  }

  .gsc-url-top {
    color: hsl(var(--muted-foreground)) !important;
  }

  .gsc-cursor-page {
    color: hsl(var(--foreground)) !important;
  }

  .gsc-loading-fade {
    background: hsl(var(--background)) !important;
  }
`;
