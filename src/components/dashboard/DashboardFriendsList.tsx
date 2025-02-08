
import { motion } from "framer-motion";
import { FriendsContent } from "@/components/feed/friends/FriendsContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { X, Settings2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import { Settings } from "../Settings";

interface DashboardFriendsListProps {
  show: boolean;
  onClose: () => void;
}

export function DashboardFriendsList({ show, onClose }: DashboardFriendsListProps) {
  const isMobile = useIsMobile();
  const [showSettings, setShowSettings] = useState(false);
  
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
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(prev => !prev)}
              className={cn(
                "hover:bg-accent/10",
                showSettings && "bg-accent/10"
              )}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-accent/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100%-3rem)] pr-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {showSettings ? (
                <Settings />
              ) : (
                <FriendsContent />
              )}
            </motion.div>
          </ScrollArea>
        </div>
      </div>
    </motion.div>
  );
}
