import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { AppRoutes } from './AppRoutes';
import { Toaster } from 'sonner';

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <AppRoutes />
      <Toaster position="top-right" expand={true} richColors />
    </SessionContextProvider>
  );
}

export default App;