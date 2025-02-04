import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface ExternalSearchSectionProps {
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export function ExternalSearchSection({ isLoading, hasError, errorMessage }: ExternalSearchSectionProps) {
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=82ea3ab8e1b0a4885";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      /* Search box styling */
      .gsc-control-cse {
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
      }

      .gsc-search-box {
        margin-bottom: 0 !important;
      }

      .gsc-input-box {
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 0.5rem !important;
        background: hsl(var(--background)) !important;
      }

      .gsc-input {
        padding-right: 0 !important;
      }

      .gsc-input-box input {
        background: transparent !important;
        color: hsl(var(--foreground)) !important;
        font-family: var(--font-sans) !important;
      }

      /* Results styling */
      .gsc-result {
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 0.5rem !important;
        margin-bottom: 1rem !important;
        padding: 1rem !important;
      }

      .gs-title {
        color: hsl(var(--primary)) !important;
        font-family: var(--font-sans) !important;
        font-size: 1rem !important;
      }

      .gs-snippet {
        color: hsl(var(--muted-foreground)) !important;
        font-family: var(--font-sans) !important;
        font-size: 0.875rem !important;
      }

      /* Remove search term highlighting */
      .gs-result .gs-title b,
      .gs-result .gs-snippet b,
      .gsc-result .gs-title em,
      .gsc-result .gs-snippet em {
        color: inherit !important;
        background: none !important;
        font-weight: inherit !important;
        font-style: inherit !important;
        text-decoration: inherit !important;
      }

      /* Suggestions styling */
      .gcsc-more-maybe-branding-root {
        margin: 0 !important;
      }

      .gcsc-more-maybe-branding-box {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
      }

      .gcsc-more-maybe-branding-box .gcsc-find-more-on-google {
        display: none !important;
      }

      .gcsc-more-maybe-branding-box .gcsc-suggestions {
        border: none !important;
        padding: 0 !important;
      }

      .gcsc-more-maybe-branding-box .gcsc-suggestion {
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 0.5rem !important;
        margin-bottom: 0.5rem !important;
        padding: 0.5rem !important;
        background: hsl(var(--background)) !important;
      }

      .gcsc-more-maybe-branding-box .gcsc-suggestion-title,
      .gcsc-more-maybe-branding-box .gcsc-suggestion-snippet {
        color: hsl(var(--foreground)) !important;
        font-family: var(--font-sans) !important;
      }

      /* Hide unwanted elements */
      .gsc-above-wrapper-area,
      .gsc-search-button,
      .gcsc-find-more-on-google-root,
      .gcsc-more-maybe-branding-box .gcsc-find-more-on-google {
        display: none !important;
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <Card className="p-4">
      <div ref={searchContainerRef} className="gcse-search" />
      {isLoading && <div>Loading...</div>}
      {hasError && <div>Error: {errorMessage}</div>}
    </Card>
  );
}