import { cn } from "@/lib/utils";

export const searchBarContainerStyles = cn(
  "w-full max-w-3xl mx-auto",
  "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
  "rounded-lg border border-border/50",
  "shadow-xl"
);

export const searchInputContainerStyles = cn(
  "relative flex items-center",
  "px-4 py-3"
);

export const searchInputStyles = cn(
  "w-full bg-transparent",
  "text-foreground placeholder:text-muted-foreground",
  "focus:outline-none focus:ring-0",
  "text-base md:text-lg"
);

export const searchButtonStyles = cn(
  "ml-2 p-2 rounded-full",
  "bg-primary/10 hover:bg-primary/20",
  "text-primary",
  "transition-colors duration-200"
);

export const searchOptionsContainerStyles = cn(
  "flex flex-wrap gap-2 px-4 pb-3",
  "animate-in fade-in-50 slide-in-from-top-2"
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