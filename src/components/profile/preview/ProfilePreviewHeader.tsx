import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/profile";
import { MessageCircle, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ProfilePreviewHeaderProps {
  profile: UserProfile;
  onRequestChat?: () => void;
}

export function ProfilePreviewHeader({ profile, onRequestChat }: ProfilePreviewHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4"
    >
      <Avatar className="h-16 w-16">
        {profile.avatar_url ? (
          <AvatarImage src={profile.avatar_url} alt={profile.full_name || ''} />
        ) : (
          <AvatarFallback>
            <UserCircle className="h-8 w-8" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{profile.full_name}</h2>
        {profile.role && (
          <p className="text-sm text-muted-foreground">{profile.role}</p>
        )}
      </div>
      {onRequestChat && (
        <Button
          variant="outline"
          size="icon"
          onClick={onRequestChat}
          className="shrink-0"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      )}
    </motion.div>
  );
}