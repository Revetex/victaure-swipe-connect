
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-4 p-6">
        <h2 className="text-2xl font-bold text-destructive">Une erreur est survenue</h2>
        <p className="text-muted-foreground">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
          toast.error("Une erreur est survenue lors du chargement des données");
        },
      },
    },
    mutations: {
      retry: 1,
      meta: {
        onError: (error: Error) => {
          console.error('Mutation error:', error);
          toast.error("Une erreur est survenue lors de la mise à jour");
        },
      },
    },
  },
});

export default function AppWrapper() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <Router>
            <App />
            <Toaster 
              position="top-right" 
              expand={false} 
              richColors 
              closeButton
            />
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
