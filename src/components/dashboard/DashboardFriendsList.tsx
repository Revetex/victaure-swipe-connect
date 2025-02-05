import { motion } from "framer-motion";
import { FriendsContent } from "@/components/feed/friends/FriendsContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { UserProfile } from "@/types/profile";
import { useState } from "react";

interface DashboardFriendsListProps {
  show: boolean;
}

export function DashboardFriendsList({ show }: DashboardFriendsListProps) {
  const isMobile = useIsMobile();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  
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
      className={cn(
        "fixed inset-x-0 bg-background/95 backdrop-blur-sm will-change-[height,opacity]",
        isMobile ? "top-[4rem] h-[calc(100vh-4rem)]" : "top-16 h-[calc(100vh-4rem)]",
        "z-[100] overflow-hidden"
      )}
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="h-full overflow-y-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="p-4">
              <div className="space-y-4">
                <ProfileSearch 
                  onSelect={setSelectedProfile}
                  placeholder="Rechercher un contact..."
                  className="w-full"
                />
                <FriendsContent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}