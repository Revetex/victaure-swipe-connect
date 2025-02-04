export function useSearchResultsStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .gsc-control-cse {
      padding: 0 !important;
      border: none !important;
      background: transparent !important;
    }

    .gsc-result {
      border-radius: 0.5rem;
      transition: all 0.2s ease-in-out;
      padding: 1rem !important;
      background: transparent !important;
    }

    .gsc-result:hover {
      transform: translateY(-2px);
    }

    .gs-title {
      color: hsl(var(--primary)) !important;
      text-decoration: none !important;
      font-size: 1.1rem !important;
      line-height: 1.5 !important;
    }

    .gs-title:hover {
      text-decoration: underline !important;
    }

    .gs-snippet {
      color: hsl(var(--foreground)) !important;
      font-size: 0.9rem !important;
      line-height: 1.6 !important;
      background: transparent !important;
    }

    .gsc-url-top {
      color: hsl(var(--muted-foreground)) !important;
      font-size: 0.8rem !important;
    }

    .gsc-cursor-page {
      color: hsl(var(--foreground)) !important;
      background: transparent !important;
      padding: 0.5rem 1rem !important;
      border-radius: 0.25rem !important;
    }

    .gsc-cursor-page:hover {
      background: hsl(var(--accent)) !important;
    }

    .gsc-cursor-current-page {
      color: hsl(var(--primary)) !important;
      background: hsl(var(--accent)) !important;
    }

    .gcsc-find-more-on-google {
      display: none !important;
    }

    .gcsc-find-more-on-google-root {
      display: none !important;
    }

    .gsc-results {
      background: transparent !important;
    }

    .gsc-webResult {
      background: transparent !important;
    }

    .gsc-webResult.gsc-result {
      background: transparent !important;
    }

    .gsc-results .gsc-cursor-box {
      background: transparent !important;
    }

    .gsc-above-wrapper-area {
      background: transparent !important;
    }
  `;
  document.head.appendChild(style);
}