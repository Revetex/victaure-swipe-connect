import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Separator } from "./ui/separator";
import { AppearanceSection } from "./settings/AppearanceSection";
import { PrivacySection } from "./settings/PrivacySection";
import { NotificationsSection } from "./settings/NotificationsSection";
import { SecuritySection } from "./settings/SecuritySection";
import { BlockedUsersSection } from "./settings/BlockedUsersSection";
import { LogoutSection } from "./settings/LogoutSection";
import { ScrollArea } from "./ui/scroll-area";
import { FriendsContent } from "./feed/friends/FriendsContent";

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
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
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto space-y-8 p-6"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Paramètres</h2>
          <p className="text-muted-foreground">
            Gérez vos préférences et paramètres de compte
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <AppearanceSection />
        </motion.div>

        <Separator />

        <motion.div variants={itemVariants}>
          <PrivacySection />
        </motion.div>

        <Separator />

        <motion.div variants={itemVariants}>
          <NotificationsSection />
        </motion.div>

        <Separator />

        <motion.div variants={itemVariants}>
          <SecuritySection />
        </motion.div>

        <Separator />

        <motion.div variants={itemVariants}>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Amis</h3>
            <div className="p-4 rounded-lg bg-muted/30">
              <FriendsContent />
            </div>
          </div>
        </motion.div>

        <Separator />

        <motion.div variants={itemVariants}>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Utilisateurs bloqués</h3>
            <div className="p-4 rounded-lg bg-muted/30">
              <BlockedUsersSection />
            </div>
          </div>
        </motion.div>

        <Separator />

        <motion.div variants={itemVariants}>
          <LogoutSection />
        </motion.div>
      </motion.div>
    </ScrollArea>
  );
}