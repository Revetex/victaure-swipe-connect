import { Logo } from "@/components/Logo";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { FriendsContent } from "@/components/feed/friends/FriendsContent";

interface DashboardHeaderProps {
  pageTitle: string;
  showFriendsList: boolean;
  isMobile: boolean;
  onFriendsListToggle: () => void;
}

export function DashboardHeader({
  pageTitle,
  showFriendsList,
  isMobile,
  onFriendsListToggle
}: DashboardHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-0 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col">
            <div className="flex items-center justify-between py-3 px-4">
              <div className="flex items-center gap-4">
                <Logo size="sm" />
                <div className="h-6 w-px bg-border mx-2" />
                <h2 className="text-lg font-semibold text-foreground">
                  {pageTitle}
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                <NotificationsBox />
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onFriendsListToggle}
                    className="relative"
                  >
                    {showFriendsList ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            {isMobile && showFriendsList && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}