import { useEffect, useState } from "react";
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";
import { motion } from "framer-motion";

export function ExternalSearchSection() {
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Search box styling */
      .gsc-input-box {
        background: transparent !important;
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 0.5rem !important;
      }
      
      .gsc-input {
        background: transparent !important;
        color: hsl(var(--foreground)) !important;
        font-family: var(--font-sans) !important;
        font-size: 0.875rem !important;
      }

      .gsc-search-button {
        background-color: hsl(var(--primary)) !important;
        border: none !important;
        border-radius: 0.5rem !important;
        padding: 8px 16px !important;
      }

      .gsc-search-button:hover {
        background-color: hsl(var(--primary)/0.9) !important;
      }

      /* Results styling */
      .gsc-result {
        background: transparent !important;
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 0.5rem !important;
        margin: 8px 0 !important;
        padding: 12px !important;
      }

      .gsc-result:hover {
        background-color: hsl(var(--accent)/0.1) !important;
      }

      .gsc-result .gs-title {
        color: hsl(var(--primary)) !important;
        font-family: var(--font-sans) !important;
        font-size: 1rem !important;
      }

      .gsc-result .gs-snippet {
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
      .gsc-completion-container {
        background: transparent !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 0.5rem !important;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
        font-family: var(--font-sans) !important;
      }

      .gsc-completion-container table {
        background: transparent !important;
      }

      .gsc-completion-container tr {
        background: transparent !important;
      }

      .gsc-completion-container td {
        background: transparent !important;
        color: hsl(var(--foreground)) !important;
        font-family: var(--font-sans) !important;
        font-size: 0.875rem !important;
        line-height: 1.5 !important;
        padding: 8px 12px !important;
      }

      .gsc-completion-container tr:hover td {
        background-color: hsl(var(--accent)/0.1) !important;
      }

      /* Remove any remaining white backgrounds */
      .gsc-control-cse,
      .gsc-control-wrapper-cse,
      .gsc-results-wrapper-nooverlay,
      .gsc-results-wrapper-visible,
      .gsc-results-wrapper-overlay,
      .gsc-results-inner-overlay,
      .gsc-results-inner-visible,
      .gsc-orderby-container,
      .gsc-webResult,
      .gsc-result {
        background: transparent !important;
      }

      /* Additional transparency fixes */
      .gsc-results .gsc-cursor-box {
        background: transparent !important;
        margin: 12px 0 !important;
      }

      .gsc-cursor-page {
        color: hsl(var(--foreground)) !important;
        background: transparent !important;
        padding: 8px 12px !important;
        border-radius: 0.25rem !important;
      }

      .gsc-cursor-page:hover,
      .gsc-cursor-current-page {
        background-color: hsl(var(--accent)/0.1) !important;
      }

      .gsc-above-wrapper-area,
      .gsc-refinementsArea {
        background: transparent !important;
        border: none !important;
      }
    `;

    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full [&_.gsc-input-box]:!bg-transparent [&_.gsc-input]:!bg-transparent"
        >
          <GoogleSearchBox />
        </motion.div>
      </div>
    </div>
  );
}