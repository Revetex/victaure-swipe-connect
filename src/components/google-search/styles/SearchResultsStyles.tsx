import { cn } from "@/lib/utils";

export const resultsContainerStyles = cn(
  "w-full max-w-3xl mx-auto mt-4 space-y-6 p-4",
  "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
);

export const resultItemStyles = cn(
  "p-4 rounded-lg",
  "bg-white dark:bg-gray-800/50",
  "hover:bg-gray-50 dark:hover:bg-gray-800",
  "transition-colors duration-200",
  "shadow-sm hover:shadow-md"
);

export const resultTitleStyles = cn(
  "text-lg font-medium mb-2",
  "text-primary hover:text-primary/90",
  "cursor-pointer"
);

export const resultUrlStyles = cn(
  "text-sm text-muted-foreground",
  "mb-2"
);

export const resultDescriptionStyles = cn(
  "text-foreground/90",
  "line-clamp-3"
);

export const loadingContainerStyles = cn(
  "w-full max-w-3xl mx-auto mt-4 p-4",
  "animate-pulse space-y-4"
);

export const loadingItemStyles = cn(
  "h-4 bg-muted rounded",
  "w-full"
);

// Export all styles as a single string for the GoogleSearchStyles component
export const SearchResultsStyles = `
  .results-container {
    ${resultsContainerStyles}
  }
  .result-item {
    ${resultItemStyles}
  }
  .result-title {
    ${resultTitleStyles}
  }
  .result-url {
    ${resultUrlStyles}
  }
  .result-description {
    ${resultDescriptionStyles}
  }
  .loading-container {
    ${loadingContainerStyles}
  }
  .loading-item {
    ${loadingItemStyles}
  }
`;