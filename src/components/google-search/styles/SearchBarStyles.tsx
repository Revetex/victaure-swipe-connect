export function useSearchBarStyles() {
  return `
    .gsc-input-box {
      border: 1px solid hsl(var(--input)) !important;
      border-radius: 0.75rem !important;
      background: transparent !important;
      padding: 8px 12px !important;
      transition: all 0.2s ease !important;
      display: flex !important;
      align-items: center !important;
    }

    .gsc-input-box:focus-within {
      border-color: hsl(var(--primary)) !important;
      box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--primary)/0.1) !important;
    }

    .gsc-input {
      background: transparent !important;
      padding-inline: 8px !important;
      font-size: 0.95rem !important;
      color: hsl(var(--foreground)) !important;
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
      margin-left: 8px !important;
      opacity: 0.7 !important;
    }

    .gsc-search-button-v2 {
      padding: 8px !important;
      border-radius: 0.5rem !important;
      background-color: transparent !important;
      border: none !important;
      transition: opacity 0.2s ease !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .gsc-search-button-v2:hover {
      opacity: 1 !important;
    }

    .gsc-search-button-v2 svg {
      width: 16px !important;
      height: 16px !important;
      fill: hsl(var(--foreground)) !important;
    }
  `;
}