import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useEffect } from "react";

// Create a client with optimized options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
  },
});

export default function AppWrapper() {
  useEffect(() => {
    // Add meta tags for better Safari compatibility
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1';
    document.head.appendChild(metaViewport);

    const metaThemeColor = document.createElement('meta');
    metaThemeColor.name = 'theme-color';
    metaThemeColor.content = '#000000';
    document.head.appendChild(metaThemeColor);

    // Clean up
    return () => {
      document.head.removeChild(metaViewport);
      document.head.removeChild(metaThemeColor);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Router>
          <App />
          <Toaster 
            position="top-right" 
            expand={false} 
            richColors 
            closeButton
          />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}