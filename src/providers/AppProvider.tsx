
import { ReactNode } from 'react';
import { VCardStyleProvider } from '@/components/vcard/VCardStyleContext';
import { ReceiverProvider } from '@/hooks/useReceiver';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';

// Création d'une seule instance du QueryClient
const queryClient = new QueryClient();

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <VCardStyleProvider>
          <ReceiverProvider>
            {children}
          </ReceiverProvider>
        </VCardStyleProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
