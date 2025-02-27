
import { useEffect } from "react";
import { Toaster } from "sonner";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./providers/AuthProvider";
import { ProfileProvider } from "./providers/ProfileProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import { ReceiverProvider } from "./providers/ReceiverProvider";
import { VictaureChatWidget } from "./components/chat/VictaureChatWidget";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  
  // Set viewport height for mobile
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);

  // Ne pas afficher le widget sur la page d'authentification
  const isAuthPage = location.pathname === "/auth";

  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <ReceiverProvider>
            <AppRoutes />
            <Toaster richColors position="top-center" />
            {!isAuthPage && <VictaureChatWidget />}
          </ReceiverProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
