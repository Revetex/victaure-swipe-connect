
import { useState } from "react";
import { motion } from "framer-motion";
import { AppearanceSection } from "./settings/AppearanceSection";
import { NotificationsSection } from "./settings/NotificationsSection";
import { PrivacySection } from "./settings/PrivacySection";
import { SecuritySection } from "./settings/SecuritySection";
import { BlockedUsersSection } from "./settings/BlockedUsersSection";
import { LogoutSection } from "./settings/LogoutSection";
import { PaymentSection } from "./settings/PaymentSection";
import { ScrollArea } from "./ui/scroll-area";
import { Palette, Bell, Shield, Lock, Ban, CreditCard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [activeSection, setActiveSection] = useState('appearance');

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* Barre latérale des paramètres */}
      <div className="w-64 border-r border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="p-4 space-y-1">
          {settingsSections.map(({ id, icon: Icon, title }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                "hover:bg-primary/10",
                activeSection === id 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {title}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              {settingsSections.map(({ id, Component, title }) => (
                activeSection === id && (
                  <div key={id} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
                    </div>
                    <div className="bg-card/50 border border-border/50 rounded-xl p-6">
                      <Component />
                    </div>
                  </div>
                )
              ))}
            </motion.div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
