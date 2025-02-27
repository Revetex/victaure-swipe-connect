
import { useEffect } from "react";
import { Toaster } from "sonner";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ThemeProvider } from "./components/ThemeProvider";
import { useReceiver } from "@/hooks/useReceiver";
import { VictaureChatWidget } from "./components/chat/VictaureChatWidget";
import { useLocation } from "react-router-dom";
import { createContext } from "react";

// Create context providers
const ProfileContext = createContext<ReturnType<typeof useProfile> | null>(null);
const ReceiverContext = createContext<ReturnType<typeof useReceiver> | null>(null);

// Provider components
export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const profileData = useProfile();
  return <ProfileContext.Provider value={profileData}>{children}</ProfileContext.Provider>;
};

export const ReceiverProvider = ({ children }: { children: React.ReactNode }) => {
  const receiverData = useReceiver();
  return <ReceiverContext.Provider value={receiverData}>{children}</ReceiverContext.Provider>;
};

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
