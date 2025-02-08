
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { AppRoutes } from './AppRoutes';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-background"
        >
          <AppRoutes />
        </motion.div>
      </AnimatePresence>
    </SessionContextProvider>
  );
}

export default App;

