import { UserProfile } from "@/types/profile";
import { motion } from "framer-motion";

interface VCardCustomizationProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export function VCardCustomization({ profile, setProfile }: VCardCustomizationProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 rounded-xl bg-card/20 backdrop-blur-md border border-border shadow-xl"
    >
      <div className="flex items-center gap-2 border-b pb-4 border-border">
        <h3 className="text-xl font-medium text-foreground">Mode édition</h3>
      </div>
    </motion.div>
  );
}