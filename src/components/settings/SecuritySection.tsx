
import { Lock } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { PasswordChangeSection } from "./PasswordChangeSection";
import { motion } from "framer-motion";

export function SecuritySection() {
  return (
    <SettingsSection title="Sécurité">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full space-y-1"
      >
        <div className="p-2 rounded-lg transition-colors hover:bg-accent">
          <PasswordChangeSection />
        </div>
      </motion.div>
    </SettingsSection>
  );
}
