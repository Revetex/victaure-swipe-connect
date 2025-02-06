import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { AppRoutes } from './AppRoutes';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <SessionContextProvider supabaseClient={supabase}>
        <AppRoutes />
      </SessionContextProvider>
    </BrowserRouter>
  );
}

export default App;