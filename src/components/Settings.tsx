
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
import { cn } from "@/lib/utils";

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
  { id: 'appearance', Component: AppearanceSection, icon: Palette, title: 'Apparence', color: 'from-purple-500/20 to-blue-500/20' },
  { id: 'notifications', Component: NotificationsSection, icon: Bell, title: 'Notifications', color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'privacy', Component: PrivacySection, icon: Shield, title: 'Confidentialité', color: 'from-green-500/20 to-emerald-500/20' },
  { id: 'security', Component: SecuritySection, icon: Lock, title: 'Sécurité', color: 'from-yellow-500/20 to-orange-500/20' },
  { id: 'payments', Component: PaymentSection, icon: CreditCard, title: 'Paiements', color: 'from-pink-500/20 to-rose-500/20' },
  { id: 'blocked', Component: BlockedUsersSection, icon: Ban, title: 'Utilisateurs bloqués', color: 'from-red-500/20 to-pink-500/20' },
  { id: 'logout', Component: LogoutSection, icon: LogOut, title: 'Déconnexion', color: 'from-gray-500/20 to-slate-500/20' }
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
      <div className="container mx-auto py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-10 px-6"
        >
          <div className="p-3 rounded-xl bg-primary/10">
            <SettingsIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Paramètres</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-6">
          {settingsSections.map(({ id, Component, icon: Icon, title, color }, index) => (
            <motion.div
              key={id}
              variants={sectionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/50",
                "backdrop-blur-sm transition-all duration-300",
                "hover:scale-[1.02] hover:shadow-lg"
              )}
            >
              <div className={cn(
                "absolute inset-0 opacity-50 bg-gradient-to-br",
                color
              )} />
              
              <div className="relative p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm 
                              group-hover:bg-white/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-medium">{title}</h2>
                </div>
                
                <div className="bg-black/5 backdrop-blur-sm rounded-xl p-6">
                  <Component />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
