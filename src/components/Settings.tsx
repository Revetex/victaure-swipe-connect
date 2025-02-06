import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { AppearanceSection } from "./settings/AppearanceSection";
import { NotificationsSection } from "./settings/NotificationsSection";
import { PrivacySection } from "./settings/PrivacySection";
import { SecuritySection } from "./settings/SecuritySection";
import { BlockedUsersSection } from "./settings/BlockedUsersSection";
import { LogoutSection } from "./settings/LogoutSection";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DashboardFriendsList } from "./dashboard/DashboardFriendsList";
import { AppHeader } from "./navigation/AppHeader";
import { BottomNavigation } from "./navigation/BottomNavigation";

const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
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
  const [showFriendsList, setShowFriendsList] = useState(false);
  const navigate = useNavigate();
  const currentPage = 5;

  return (
    <div className="min-h-screen bg-background relative">
      <AppHeader
        title="Paramètres"
        showFriendsList={showFriendsList}
        onToggleFriendsList={() => setShowFriendsList(!showFriendsList)}
        isEditing={false}
      />

      <AnimatePresence mode="wait">
        {showFriendsList && (
          <DashboardFriendsList 
            show={showFriendsList} 
            onClose={() => setShowFriendsList(false)}
          />
        )}
      </AnimatePresence>

      <ScrollArea className="h-[calc(100vh-8rem)] container mx-auto px-4 py-6">
        <motion.div
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-8 max-w-4xl mx-auto"
        >
          <AppearanceSection />
          <NotificationsSection />
          <PrivacySection />
          <SecuritySection />
          <BlockedUsersSection />
          <LogoutSection />
        </motion.div>
      </ScrollArea>

      <BottomNavigation 
        currentPage={currentPage} 
        onPageChange={(page) => {
          if (page !== 5) {
            navigate('/dashboard');
          }
        }}
        isEditing={false}
      />
    </div>
  );
}