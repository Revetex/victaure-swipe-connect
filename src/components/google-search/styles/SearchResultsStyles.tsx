export const SearchResultsStyles = `
  .results-container {
    @apply w-full max-w-3xl mx-auto mt-4 space-y-6 p-4 
    bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
    border border-border/50 rounded-lg;
  }

  .result-item {
    @apply p-4 rounded-lg 
    bg-white/5 dark:bg-gray-800/50
    hover:bg-white/10 dark:hover:bg-gray-800/60
    transition-colors duration-200
    backdrop-blur-sm
    border border-border/50;
  }

  .result-title {
    @apply text-lg font-medium mb-2
    text-primary hover:text-primary/90
    cursor-pointer;
  }

  .result-url {
    @apply text-sm text-muted-foreground mb-2;
  }

  .result-description {
    @apply text-foreground/90 line-clamp-3;
  }
`;