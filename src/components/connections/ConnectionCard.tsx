
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserMinus } from "lucide-react";
import { motion } from "framer-motion";
import { ProfileNameButton } from "@/components/profile/ProfileNameButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useConnectionActions } from "./hooks/useConnectionActions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ConnectionCardProps {
  connection: UserProfile;
}

export function ConnectionCard({ connection }: ConnectionCardProps) {
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);
  const { handleRemoveFriend } = useConnectionActions(connection.id);

  const handleMessageClick = () => {
    navigate(`/messages?receiver=${connection.id}`);
  };

  const handleRemoveConnection = async () => {
    try {
      setIsRemoving(true);
      await handleRemoveFriend();
      toast.success(`${connection.full_name} a été retiré de vos connexions`);
    } catch (error) {
      toast.error("Erreur lors de la suppression de la connexion");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-xl"
    >
      <div className="relative z-10 flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-[#F2FCE2]/50 via-[#D3E4FD]/30 to-[#FFDEE2]/20 backdrop-blur-sm border border-zinc-200/30 hover:border-primary/20 transition-all duration-300 group">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={connection.avatar_url || "/user-icon.svg"}
              alt={connection.full_name || "Utilisateur"}
              className="h-12 w-12 rounded-xl object-cover ring-2 ring-zinc-200/50 group-hover:ring-primary/30 transition-all"
            />
            {connection.online_status && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500/80 border-2 border-white shadow-lg"
              />
            )}
          </div>
          
          <div className="space-y-1">
            <ProfileNameButton
              profile={connection}
              className={cn(
                "text-sm font-medium",
                "text-zinc-700 group-hover:text-primary/90",
                "transition-colors p-0 h-auto"
              )}
            />
            <p className="text-xs text-zinc-500 group-hover:text-zinc-600 transition-colors">
              {connection.role}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 hover:bg-white shadow-lg"
            onClick={handleMessageClick}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="bg-white/80 hover:bg-white shadow-lg text-destructive hover:text-destructive"
            onClick={handleRemoveConnection}
            disabled={isRemoving}
          >
            <UserMinus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
