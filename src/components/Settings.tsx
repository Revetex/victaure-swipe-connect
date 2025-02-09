
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppearanceSection } from "./settings/AppearanceSection";
import { NotificationsSection } from "./settings/NotificationsSection";
import { PrivacySection } from "./settings/PrivacySection";
import { SecuritySection } from "./settings/SecuritySection";
import { BlockedUsersSection } from "./settings/BlockedUsersSection";
import { LogoutSection } from "./settings/LogoutSection";
import { ScrollArea } from "./ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { DashboardFriendsList } from "./dashboard/DashboardFriendsList";
import { SettingsLayout } from "./settings/SettingsLayout";
import { DashboardNavigation } from "./layout/DashboardNavigation";

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

const settingsSections = [
  { id: 'appearance', Component: AppearanceSection },
  { id: 'notifications', Component: NotificationsSection },
  { id: 'privacy', Component: PrivacySection },
  { id: 'security', Component: SecuritySection },
  { id: 'blocked', Component: BlockedUsersSection },
  { id: 'logout', Component: LogoutSection }
];

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
      {/* Header */}
      <header className="h-12 border-b bg-background/95 backdrop-blur fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4">
        <h1 className="font-semibold">Paramètres</h1>
      </header>

      <AnimatePresence mode="wait">
        {showFriendsList && (
          <DashboardFriendsList 
            show={showFriendsList} 
            onClose={() => setShowFriendsList(false)}
          />
        )}
      </AnimatePresence>

      <ScrollArea className="h-[calc(100vh-8rem)] overflow-y-auto">
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            },
            exit: { opacity: 0 }
          }}
          className="container mx-auto px-4 py-6 space-y-8 max-w-2xl"
        >
          {settingsSections.map(({ id, Component }, index) => (
            <motion.div
              key={id}
              variants={sectionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ delay: index * 0.1 }}
            >
              <Component />
            </motion.div>
          ))}
        </motion.div>
      </ScrollArea>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <DashboardNavigation 
          currentPage={currentPage} 
          onPageChange={(page) => {
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

