
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, UserMinus } from "lucide-react";
import { motion } from "framer-motion";
import { ProfileNameButton } from "@/components/profile/ProfileNameButton";
import { useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import type { Receiver } from "@/types/messages";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface FriendCardProps {
  friend: UserProfile;
  onRemove?: () => void;
}

export function FriendCard({
  friend,
  onRemove
}: FriendCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isRemoving, setIsRemoving] = useState(false);
  const {
    setReceiver,
    setShowConversation
  } = useReceiver();

  const handleStartChat = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour envoyer un message");
      return;
    }

    const receiver: Receiver = {
      id: friend.id,
      full_name: friend.full_name,
      avatar_url: friend.avatar_url || "/user-icon.svg",
      email: friend.email,
      role: friend.role as 'professional' | 'business' | 'admin',
      bio: friend.bio || null,
      phone: friend.phone || null,
      city: friend.city || null,
      state: friend.state || null,
      country: friend.country || null,
      skills: friend.skills || [],
      latitude: friend.latitude || null,
      longitude: friend.longitude || null,
      online_status: friend.online_status ? 'online' : 'offline',
      last_seen: friend.last_seen || null,
      certifications: friend.certifications || [],
      education: friend.education || [],
      experiences: friend.experiences || [],
      friends: friend.friends?.map(f => f.id) || []
    };
    setReceiver(receiver);
    setShowConversation(true);
    navigate('/messages');
  };

  const handleRemoveFriend = async () => {
    if (!user?.id) {
      toast.error("Vous devez être connecté pour supprimer cet ami");
      return;
    }

    try {
      setIsRemoving(true);
      
      // Récupérer l'ID de la connexion
      const { data: connectionData, error: connectionError } = await supabase
        .from('user_connections')
        .select('id')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${friend.id}),and(sender_id.eq.${friend.id},receiver_id.eq.${user.id})`)
        .eq('status', 'accepted')
        .single();

      if (connectionError) throw connectionError;

      // Supprimer la connexion
      const { error } = await supabase.rpc('remove_friend', {
        p_connection_id: connectionData.id,
        p_user_id: user.id
      });

      if (error) throw error;

      toast.success(`${friend.full_name} retiré de vos contacts`);
      if (onRemove) onRemove();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error("Erreur lors de la suppression de l'ami");
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
      <div className="relative z-10 flex items-center justify-between p-4 bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#64B5D9]/20 transition-all duration-300 group rounded-xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={friend.avatar_url || "/user-icon.svg"} 
              alt={friend.full_name || "User"} 
              className="h-12 w-12 rounded-xl ring-2 ring-white/10 group-hover:ring-[#64B5D9]/30 transition-all object-scale-down" 
            />
            {friend.online_status && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500/80 border-2 border-[#1B2A4A] shadow-lg" 
              />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ProfileNameButton 
                profile={friend} 
                className="text-sm font-medium text-white group-hover:text-[#64B5D9] transition-colors p-0 h-auto" 
              />
              {friend.verified && (
                <Star className="h-3.5 w-3.5 text-[#64B5D9] fill-[#64B5D9]" />
              )}
            </div>
            <p className="text-xs text-white/60">
              {friend.role}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleStartChat}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white hover:text-[#64B5D9]"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemoveFriend}
            disabled={isRemoving}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white hover:text-red-500"
          >
            {isRemoving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <UserMinus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// Création d'un composant skeleton pour le chargement
export function FriendCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden">
      <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
