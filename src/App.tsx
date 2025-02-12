
import React, { Suspense } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { AppRoutes } from './AppRoutes';
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ErrorBoundary } from 'react-error-boundary';
import { DashboardErrorBoundary } from './components/dashboard/layout/DashboardErrorBoundary';
import { DashboardLoading } from './components/dashboard/layout/DashboardLoading';

// Configuration optimisée du QueryClient pour la production
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 heures
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: 'always',
    },
  },
});

function App() {
  return (
    <ErrorBoundary FallbackComponent={DashboardErrorBoundary}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <SessionContextProvider supabaseClient={supabase}>
            <Suspense fallback={<DashboardLoading />}>
              <AppRoutes />
              <Toaster 
                position="top-right" 
                expand={false} 
                richColors 
                closeButton
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  },
                }}
              />
            </Suspense>
            <Analytics debug={false} />
            <SpeedInsights />
          </SessionContextProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
