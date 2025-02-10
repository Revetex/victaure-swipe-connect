
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail, Globe, Download } from "lucide-react";
import { motion } from "framer-motion";

interface ProfilePreviewCardProps {
  profile: UserProfile;
  onRequestChat?: () => void;
  onClose: () => void;
}

export function ProfilePreviewCard({
  profile,
  onRequestChat,
  onClose,
}: ProfilePreviewCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="p-6 bg-gradient-to-br from-emerald-50 via-teal-100 to-emerald-200 dark:from-emerald-900/80 dark:via-teal-800/80 dark:to-emerald-700/80">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
            <AvatarFallback>
              {profile.full_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{profile.full_name}</h2>
            <p className="text-sm text-muted-foreground">{profile.role}</p>
          </div>

          {profile.company_name && (
            <p className="text-sm font-medium">
              {profile.company_name}
            </p>
          )}

          <div className="w-full pt-4 grid grid-cols-2 gap-3">
            {profile.email && (
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={() => window.location.href = `mailto:${profile.email}`}
              >
                <Mail className="w-4 h-4" />
                Email
              </Button>
            )}
            
            {profile.phone && (
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => window.location.href = `tel:${profile.phone}`}
              >
                <Phone className="w-4 h-4" />
                Téléphone
              </Button>
            )}

            {profile.website && (
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => window.open(profile.website, '_blank')}
              >
                <Globe className="w-4 h-4" />
                Site Web
              </Button>
            )}

            {onRequestChat && (
              <Button
                variant="default"
                className="w-full flex items-center gap-2"
                onClick={onRequestChat}
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
