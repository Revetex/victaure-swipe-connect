
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { AppRoutes } from './AppRoutes';

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <AppRoutes />
    </SessionContextProvider>
  );
}

export default App;

