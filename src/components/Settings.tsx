
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
import { DashboardLayout } from "./DashboardLayout";
import { Footer } from "./layout/Footer";

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
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="flex min-h-screen flex-col">
        <ScrollArea className="flex-1">
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
        <Footer />
      </div>
    </DashboardLayout>
  );
}
