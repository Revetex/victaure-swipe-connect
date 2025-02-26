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
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} whileHover={{
    scale: 1.02
  }} className="relative overflow-hidden rounded-xl">
      <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-br from-[#F2FCE2]/50 via-[#D3E4FD]/30 to-[#FFDEE2]/20 backdrop-blur-sm border border-zinc-200/30 hover:border-primary/20 transition-all duration-300 group py-0 px-0 rounded bg-transparent">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={friend.avatar_url || "/user-icon.svg"} alt={friend.full_name || "User"} className="h-12 w-12 rounded-xl ring-2 ring-zinc-200/50 group-hover:ring-primary/30 transition-all object-scale-down" />
            {friend.online_status && <motion.div initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500/80 border-2 border-white shadow-lg" />}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ProfileNameButton profile={friend} className="text-sm font-medium text-zinc-700 group-hover:text-primary/90 transition-colors p-0 h-auto" />
              {friend.verified && <Star className="h-3.5 w-3.5 text-primary fill-primary" />}
            </div>
            <p className="text-xs text-zinc-500 group-hover:text-zinc-600 transition-colors">
              {friend.role}
            </p>
          </div>
        </div>

        <Button variant="secondary" size="icon" className="bg-white/80 hover:bg-white shadow-lg" onClick={handleStartChat}>
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>;
}