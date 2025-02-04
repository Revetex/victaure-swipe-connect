import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import { Toaster } from 'sonner';

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" expand={true} richColors />
      </Router>
    </SessionContextProvider>
  );
}

export default App;