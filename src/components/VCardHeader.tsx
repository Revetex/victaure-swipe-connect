import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { UserProfile } from "@/types/profile";

interface VCardHeaderProps {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: UserProfile) => void;
}

export function VCardHeader({ profile, isEditing, setProfile }: VCardHeaderProps) {
  const handleInputChange = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4"
    >
      <Avatar className="h-20 w-20 ring-2 ring-white/20 shrink-0">
        <AvatarImage 
          src={profile.avatar_url || ''} 
          alt={profile.full_name || ''}
          className="object-cover w-full h-full"
        />
        <AvatarFallback className="bg-muted">
          <UserCircle2 className="h-12 w-12 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 space-y-1">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={profile.full_name || ""}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              placeholder="Votre nom complet"
              className="text-xl font-semibold bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Input
              value={profile.role || ""}
              onChange={(e) => handleInputChange("role", e.target.value)}
              placeholder="Votre rôle"
              className="text-sm bg-white/10 border-white/20 text-white/90 placeholder:text-white/50"
            />
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white truncate">
              {profile.full_name || "Nom non défini"}
            </h2>
            <p className="text-sm text-white/90">
              {profile.role || "Rôle non défini"}
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}