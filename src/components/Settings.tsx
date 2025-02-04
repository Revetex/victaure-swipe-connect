import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Separator } from "./ui/separator";
import { AppearanceSection } from "./settings/AppearanceSection";
import { PrivacySection } from "./settings/PrivacySection";
import { NotificationsSection } from "./settings/NotificationsSection";
import { SecuritySection } from "./settings/SecuritySection";
import { BlockedUsersSection } from "./settings/BlockedUsersSection";
import { LogoutSection } from "./settings/LogoutSection";
import { SettingsSection } from "./settings/SettingsSection";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export function Settings() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border border-border/50 shadow-lg"
    >
      <div className="space-y-6">
        <motion.div variants={itemVariants}>
          <AppearanceSection />
        </motion.div>

        <Separator className="my-6" />

        <motion.div variants={itemVariants}>
          <PrivacySection />
        </motion.div>

        <Separator className="my-6" />

        <motion.div variants={itemVariants}>
          <NotificationsSection />
        </motion.div>

        <Separator className="my-6" />

        <motion.div variants={itemVariants}>
          <SecuritySection />
        </motion.div>

        <Separator className="my-6" />

        <motion.div variants={itemVariants}>
          <SettingsSection title="Utilisateurs bloqués">
            <div className="p-4 rounded-lg bg-muted/30">
              <BlockedUsersSection />
            </div>
          </SettingsSection>
        </motion.div>

        <Separator className="my-6" />

        <motion.div variants={itemVariants}>
          <LogoutSection />
        </motion.div>
      </div>
    </motion.div>
  );
}