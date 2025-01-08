import { AnimatePresence, motion } from "framer-motion";
import { VCardEditingHeader } from "../sections/VCardEditingHeader";
import { VCardCustomization } from "../VCardCustomization";
import { UserProfile } from "@/types/profile";

interface VCardEditingModeProps {
  showCustomization: boolean;
  setShowCustomization: (show: boolean) => void;
  onBack: () => void;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export function VCardEditingMode({
  showCustomization,
  setShowCustomization,
  onBack,
  profile,
  setProfile
}: VCardEditingModeProps) {
  return (
    <>
      <VCardEditingHeader
        onBack={onBack}
        onCustomize={() => setShowCustomization(!showCustomization)}
        showCustomization={showCustomization}
      />

      <AnimatePresence>
        {showCustomization && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <VCardCustomization profile={profile} setProfile={setProfile} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}