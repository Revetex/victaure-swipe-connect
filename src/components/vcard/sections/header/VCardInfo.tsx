import { UserProfile } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface VCardInfoProps {
  profile: UserProfile;
  isEditing: boolean;
  handleInputChange: (key: string, value: string) => void;
}

export function VCardInfo({ profile, isEditing, handleInputChange }: VCardInfoProps) {
  return (
    <div className="space-y-2">
      {isEditing ? (
        <>
          <Input
            value={profile.full_name || ""}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            placeholder="Votre nom complet"
            className="text-xl font-semibold bg-transparent border-none focus:ring-1 focus:ring-primary/20"
          />
          <Input
            value={profile.role || ""}
            onChange={(e) => handleInputChange('role', e.target.value)}
            placeholder="Votre rôle"
            className="text-sm text-muted-foreground bg-transparent border-none focus:ring-1 focus:ring-primary/20"
          />
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h2 className="text-xl font-semibold">
            {profile.full_name || "Nom non défini"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {profile.role || "Rôle non défini"}
          </p>
        </motion.div>
      )}
    </div>
  );
}