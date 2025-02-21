
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/types/profile";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

interface VCardInfoProps {
  profile: UserProfile;
  isEditing: boolean;
  handleInputChange: (key: string, value: string) => void;
}

export function VCardInfo({ profile, isEditing, handleInputChange }: VCardInfoProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex-1 min-w-0 space-y-2 w-full">
      {isEditing ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 w-full"
        >
          <Input
            value={profile.full_name || ""}
            onChange={(e) => handleInputChange("full_name", e.target.value)}
            placeholder="Votre nom"
            className={`
              text-lg font-medium bg-card/5 border-border/10 
              placeholder:text-muted-foreground/50 w-full
              ${isMobile ? 'p-4 text-center' : 'sm:text-xl'}
            `}
          />
          <Input
            value={profile.role || ""}
            onChange={(e) => handleInputChange("role", e.target.value)}
            placeholder="Votre rôle"
            className={`
              bg-card/5 border-border/10 
              placeholder:text-muted-foreground/50 w-full
              ${isMobile ? 'p-4 text-center' : 'sm:text-base'}
            `}
          />
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`space-y-1 ${isMobile ? 'text-center' : ''}`}
        >
          {profile.full_name && (
            <h2 className={`
              font-bold truncate text-primary
              ${isMobile ? 'text-xl' : 'text-xl sm:text-2xl'}
            `}>
              {profile.full_name}
            </h2>
          )}
          {profile.role && (
            <p className={`
              text-primary/70
              ${isMobile ? 'text-sm' : 'text-sm sm:text-base'}
            `}>
              {profile.role}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
