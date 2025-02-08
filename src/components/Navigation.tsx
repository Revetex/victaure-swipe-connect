
import { MessageSquare, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeedSidebar } from "./feed/FeedSidebar";
import { useState } from "react";
import { ProfilePreview } from "./ProfilePreview";

export function Navigation() {
  const { isLoading, user } = useAuth();
  const [showProfilePreview, setShowProfilePreview] = useState(false);

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Logo Section */}
      <div className="h-16 border-b flex items-center px-4">
        <motion.div 
          className="flex items-center gap-3 group cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={() => setShowProfilePreview(true)}
        >
          <Logo size="sm" />
        </motion.div>
      </div>

      {/* Navigation Content */}
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-6">
          <div className="space-y-2">
            <Link 
              to="/dashboard/messages" 
              className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Paramètres</span>
            </Link>
          </div>
          <FeedSidebar />
        </nav>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="h-16 border-t bg-background/50 backdrop-blur flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <NotificationsBox />
          <ThemeToggle />
        </div>
      </div>

      {/* Profile Preview */}
      {user && (
        <ProfilePreview
          profile={user}
          isOpen={showProfilePreview}
          onClose={() => setShowProfilePreview(false)}
        />
      )}
    </div>
  );
}

