import { cn } from "@/lib/utils";

export const searchBarContainerStyles = cn(
  "w-full max-w-3xl mx-auto p-4 space-y-4",
  "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
  "border border-border/50 rounded-lg shadow-lg"
);

export const searchInputContainerStyles = cn(
  "flex items-center gap-2 w-full",
  "bg-white dark:bg-gray-800",
  "border border-border/50 rounded-lg",
  "shadow-sm hover:shadow-md transition-shadow",
  "focus-within:ring-2 focus-within:ring-primary/50"
);

export const searchInputStyles = cn(
  "flex-1 px-4 py-2",
  "bg-transparent",
  "text-foreground placeholder:text-muted-foreground",
  "focus:outline-none"
);

export const searchButtonStyles = cn(
  "p-2 rounded-r-lg",
  "bg-primary hover:bg-primary/90",
  "text-primary-foreground",
  "transition-colors"
);

export const searchOptionsContainerStyles = cn(
  "flex flex-wrap gap-2",
  "text-sm text-muted-foreground"
);

export const searchOptionStyles = cn(
  "px-3 py-1 rounded-full",
  "bg-muted/50 hover:bg-muted",
  "cursor-pointer transition-colors"
);

// Export all styles as a single string for the GoogleSearchStyles component
export const SearchBarStyles = `
  .search-bar-container {
    ${searchBarContainerStyles}
  }
  .search-input-container {
    ${searchInputContainerStyles}
  }
  .search-input {
    ${searchInputStyles}
  }
  .search-button {
    ${searchButtonStyles}
  }
  .search-options-container {
    ${searchOptionsContainerStyles}
  }
  .search-option {
    ${searchOptionStyles}
  }
`;