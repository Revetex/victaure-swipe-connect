
import { UserProfile } from "@/types/profile";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ProfilePreviewCardProps {
  profile: UserProfile;
  onRequestChat?: () => void;
  onClose: () => void;
  canViewFullProfile?: boolean;
}

export function ProfilePreviewCard({
  profile,
  onClose,
  canViewFullProfile = false
}: ProfilePreviewCardProps) {
  const navigate = useNavigate();

  const handleRequestChat = () => {
    navigate(`/dashboard/messages?receiver=${profile.id}`);
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="w-20 h-20 border-2 border-primary/10">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
            <AvatarFallback>
              {profile.full_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {profile.full_name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile.role}
            </p>
          </div>

          {canViewFullProfile ? (
            <>
              {profile.company_name && (
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {profile.company_name}
                </p>
              )}

              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={handleRequestChat}
              >
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span className="text-sm">Profil privé</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
