import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppearanceSection } from "./settings/AppearanceSection";
import { NotificationsSection } from "./settings/NotificationsSection";
import { PrivacySection } from "./settings/PrivacySection";
import { SecuritySection } from "./settings/SecuritySection";
import { BlockedUsersSection } from "./settings/BlockedUsersSection";
import { LogoutSection } from "./settings/LogoutSection";
import { ScrollArea } from "./ui/scroll-area";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";
import { useNavigate } from "react-router-dom";
import { DashboardFriendsList } from "./dashboard/DashboardFriendsList";
import { AppHeader } from "./navigation/AppHeader";
import { SettingsLayout } from "./settings/SettingsLayout";

const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  }
};

export function Settings() {
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(5);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBackToHome = () => {
    navigate('/dashboard');
  };

  if (!mounted) {
    return null;
  }

  return (
    <SettingsLayout>
      <AppHeader 
        title="Paramètres"
        showFriendsList={showFriendsList}
        onToggleFriendsList={() => setShowFriendsList(!showFriendsList)}
        isEditing={false}
        onToolReturn={handleBackToHome}
      />

      <AnimatePresence mode="wait">
        {showFriendsList && (
          <DashboardFriendsList 
            show={showFriendsList} 
            onClose={() => setShowFriendsList(false)}
          />
        )}
      </AnimatePresence>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <motion.div
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="container mx-auto px-4 py-6 space-y-8"
        >
          <AppearanceSection />
          <NotificationsSection />
          <PrivacySection />
          <SecuritySection />
          <BlockedUsersSection />
          <LogoutSection />
        </motion.div>
      </ScrollArea>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <DashboardNavigation 
          currentPage={currentPage} 
          onPageChange={(page) => {
            setCurrentPage(page);
            if (page !== 5) {
              navigate('/dashboard');
            }
          }}
          isEditing={false}
        />
      </div>
    </SettingsLayout>
  );
}