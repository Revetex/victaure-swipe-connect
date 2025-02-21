
import { UserProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

interface FriendCardProps {
  friend: UserProfile;
}

export function FriendCard({ friend }: FriendCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/30 hover:border-primary/20 transition-all duration-300 group">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={friend.avatar_url || "/user-icon.svg"}
              alt={friend.full_name || "User"}
              className="h-12 w-12 rounded-xl object-cover ring-2 ring-zinc-700/50 group-hover:ring-primary/30 transition-all"
            />
            {friend.online_status && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500/80 border-2 border-zinc-900 shadow-lg"
              />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-white group-hover:text-primary/90 transition-colors">
                {friend.full_name}
              </p>
              {friend.verified && (
                <Star className="h-3.5 w-3.5 text-primary fill-primary" />
              )}
            </div>
            <p className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
              {friend.role}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-primary hover:bg-primary/10 transition-all duration-300"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}
