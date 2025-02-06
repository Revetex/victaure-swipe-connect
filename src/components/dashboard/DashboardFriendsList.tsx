import { motion } from "framer-motion";
import { FriendsContent } from "@/components/feed/friends/FriendsContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { ToolSelector } from "@/components/tools/sections/ToolSelector";
import { Separator } from "../ui/separator";

interface DashboardFriendsListProps {
  show: boolean;
  onClose: () => void;
}

export function DashboardFriendsList({ show, onClose }: DashboardFriendsListProps) {
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
        isMobile ? 'fixed inset-x-0 top-[4rem] z-[100] max-h-[80vh] overflow-y-auto' : 'fixed inset-x-0 top-[4rem] z-[100]'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="p-4">
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <ToolSelector />
              </div>
              <Separator className="my-4" />
              <FriendsContent />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}