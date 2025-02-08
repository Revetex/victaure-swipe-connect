
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { AppRoutes } from './AppRoutes';

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <AppRoutes />
      </Router>
    </SessionContextProvider>
  );
}

export default App;
