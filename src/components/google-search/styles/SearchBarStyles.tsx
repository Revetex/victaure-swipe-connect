export function useSearchBarStyles() {
  return `
    .gsc-input-box {
      border: 1px solid hsl(var(--input)) !important;
      border-radius: 0.75rem !important;
      background: transparent !important;
      padding: 8px 12px !important;
      transition: border-color 0.2s ease !important;
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
    }

    .gsc-search-button {
      margin-left: 8px !important;
    }

    .gsc-search-button-v2 {
      padding: 8px 12px !important;
      border-radius: 0.75rem !important;
      background-color: hsl(var(--primary)) !important;
      border: none !important;
      transition: opacity 0.2s ease !important;
    }

    .gsc-search-button-v2:hover {
      background-color: hsl(var(--primary)) !important;
      opacity: 0.9 !important;
    }

    .gsc-search-button-v2 svg {
      width: 16px !important;
      height: 16px !important;
      fill: hsl(var(--background)) !important;
    }
  `;
}