import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { FriendsContent } from "../feed/friends/FriendsContent";

interface DashboardFriendsListProps {
  show: boolean;
}

export function DashboardFriendsList({ show }: DashboardFriendsListProps) {
  const isMobile = useIsMobile();

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.15,
        ease: "easeInOut"
      }}
      className={cn(
        "fixed inset-x-0 bg-background/95 backdrop-blur-sm",
        isMobile ? "top-[4rem]" : "top-16",
        "bottom-16 z-[9999] overflow-y-auto", // Added overflow-y-auto and adjusted bottom to account for navigation
      )}
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <FriendsContent />
        </div>
      </div>
    </motion.div>
  );
}