import { motion } from "framer-motion";
import { FriendsContent } from "@/components/feed/friends/FriendsContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DashboardFriendsListProps {
  show: boolean;
  onClose: () => void;
}

export function DashboardFriendsList({ show, onClose }: DashboardFriendsListProps) {
  const isMobile = useIsMobile();
  
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "fixed inset-x-0 top-[4rem] z-[100] bg-background/95 backdrop-blur-sm border-b",
        "overflow-hidden shadow-lg",
        isMobile ? "h-[calc(100vh-4rem)]" : "h-[70vh]"
      )}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="max-w-3xl mx-auto relative h-full py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-0 top-0"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="h-full overflow-y-auto">
            <FriendsContent />
          </div>
        </div>
      </div>
    </motion.div>
  );
}