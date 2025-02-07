
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProfileNameButton } from "@/components/profile/ProfileNameButton";
import { UserProfile } from "@/types/profile";

interface FriendListProps {
  friends: UserProfile[];
  currentPage: number;
  itemsPerPage: number;
}

export function FriendList({ friends, currentPage, itemsPerPage }: FriendListProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFriends = friends.slice(startIndex, endIndex);

  return (
    <ScrollArea className="h-[300px] pr-2">
      <AnimatePresence mode="wait">
        <div className="space-y-1">
          {currentFriends.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ 
                delay: index * 0.05,
                type: "spring",
                stiffness: 260,
                damping: 20 
              }}
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full flex items-center gap-3 h-auto p-2.5",
                  "hover:bg-accent/5 transition-all duration-200",
                  "group relative"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden relative">
                  {friend.avatar_url ? (
                    <img
                      src={friend.avatar_url}
                      alt={friend.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                  {friend.online_status && (
                    <motion.div 
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-background"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <ProfileNameButton 
                    profile={friend}
                    className="p-0 h-auto text-sm font-medium group-hover:text-primary transition-colors duration-200"
                  />
                  <p className="text-xs text-muted-foreground truncate">
                    {friend.online_status ? 'En ligne' : 'Hors ligne'}
                  </p>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </ScrollArea>
  );
}
