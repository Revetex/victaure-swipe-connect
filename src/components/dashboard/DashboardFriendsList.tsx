import { motion } from "framer-motion";
import { FriendsContent } from "@/components/feed/friends/FriendsContent";

interface DashboardFriendsListProps {
  show: boolean;
}

export function DashboardFriendsList({ show }: DashboardFriendsListProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-sm"
    >
      <div className="p-4">
        <div className="space-y-4">
          <FriendsContent />
        </div>
      </div>
    </motion.div>
  );
}