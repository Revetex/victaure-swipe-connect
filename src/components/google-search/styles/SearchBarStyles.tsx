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
    border: 2px solid hsl(var(--border)) !important;
    border-radius: 0.5rem !important;
    background: hsl(var(--background)) !important;
    padding: 0.5rem !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
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
`;