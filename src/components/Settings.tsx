
import { SettingsSection } from "./settings/SettingsSection";
import { SecuritySection } from "./settings/SecuritySection";
import { AppearanceSection } from "./settings/AppearanceSection";
import { NotificationsSection } from "./settings/NotificationsSection";
import { LogoutSection } from "./settings/LogoutSection";
import { motion } from "framer-motion";

export default function Settings() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto p-4 max-w-2xl space-y-6"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
            Paramètres
          </h1>
          <p className="text-muted-foreground">
            Gérez vos préférences et personnalisez votre expérience
          </p>
        </motion.div>

        <div className="grid gap-6">
          <SettingsSection title="Apparence">
            <AppearanceSection />
          </SettingsSection>

          <SettingsSection title="Notifications">
            <NotificationsSection />
          </SettingsSection>

          <SecuritySection />

          <LogoutSection />
        </div>
      </motion.div>
    </div>
  );
}
