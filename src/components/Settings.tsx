
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppearanceSection } from "./settings/AppearanceSection";
import { NotificationsSection } from "./settings/NotificationsSection";
import { PrivacySection } from "./settings/PrivacySection";
import { SecuritySection } from "./settings/SecuritySection";
import { BlockedUsersSection } from "./settings/BlockedUsersSection";
import { LogoutSection } from "./settings/LogoutSection";
import { PaymentSection } from "./settings/PaymentSection";
import { ScrollArea } from "./ui/scroll-area";
import { Settings as SettingsIcon, Palette, Bell, Shield, Lock, Ban, CreditCard, LogOut } from "lucide-react";

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
  { id: 'appearance', Component: AppearanceSection, icon: Palette, title: 'Apparence' },
  { id: 'notifications', Component: NotificationsSection, icon: Bell, title: 'Notifications' },
  { id: 'privacy', Component: PrivacySection, icon: Shield, title: 'Confidentialité' },
  { id: 'security', Component: SecuritySection, icon: Lock, title: 'Sécurité' },
  { id: 'payments', Component: PaymentSection, icon: CreditCard, title: 'Paiements' },
  { id: 'blocked', Component: BlockedUsersSection, icon: Ban, title: 'Utilisateurs bloqués' },
  { id: 'logout', Component: LogoutSection, icon: LogOut, title: 'Déconnexion' }
];

export function Settings() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsSections.map(({ id, Component, icon: Icon, title }, index) => (
            <motion.div
              key={id}
              variants={sectionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ delay: index * 0.1 }}
              className="bg-card hover:bg-accent/5 rounded-lg border border-border/50 backdrop-blur-sm transition-colors"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-medium">{title}</h2>
                </div>
                <Component />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
