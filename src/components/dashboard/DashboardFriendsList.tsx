import { motion } from "framer-motion";
import { FriendsContent } from "@/components/feed/friends/FriendsContent";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardFriendsListProps {
  show: boolean;
}

export function DashboardFriendsList({ show }: DashboardFriendsListProps) {
  const isMobile = useIsMobile();
  
  if (!show) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ 
        duration: 0.15,
        ease: "easeInOut"
      }}
      className={`overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-sm will-change-[height,opacity] ${
        isMobile ? 'fixed inset-x-0 top-[4rem] z-[100] max-h-[80vh] overflow-y-auto' : 'relative'
      }`}
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="p-4">
            <div className="space-y-4">
              <FriendsContent />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}