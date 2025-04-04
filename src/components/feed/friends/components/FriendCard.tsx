
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { ProfileNameButton } from "@/components/profile/ProfileNameButton";
import { useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import type { Receiver } from "@/types/messages";

interface FriendCardProps {
  friend: UserProfile;
}

export function FriendCard({
  friend
}: FriendCardProps) {
  const navigate = useNavigate();
  const {
    setReceiver,
    setShowConversation
  } = useReceiver();

  const handleStartChat = () => {
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

        <Button
          variant="ghost"
          size="icon"
          onClick={handleStartChat}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white hover:text-[#64B5D9]"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
