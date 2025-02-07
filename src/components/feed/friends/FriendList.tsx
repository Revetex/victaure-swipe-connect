
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types/profile";
import { FriendItem } from "./FriendItem";

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
              <FriendItem 
                friend={{
                  ...friend,
                  online_status: friend.online_status || false,
                  last_seen: friend.last_seen || new Date().toISOString()
                }}
                onMessage={(friendId) => {
                  // Navigate to messages with this friend
                  window.location.href = `/dashboard/messages?receiver=${friendId}`;
                }}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </ScrollArea>
  );
}
