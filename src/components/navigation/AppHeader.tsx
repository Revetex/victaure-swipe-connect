
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AppHeaderProps {
  title: string;
  showFriendsList: boolean;
  onToggleFriendsList: () => void;
  isEditing: boolean;
  onToolReturn?: () => void;
}

export function AppHeader({
  title,
  isEditing,
}: AppHeaderProps) {
  // Hide header if any parent element has z-index 99999 (chat overlay)
  const overlayElement = document.querySelector('[style*="z-index: 99999"]');
  if (overlayElement) return null;

  return (
    <div className="sticky top-0 left-0 right-0 w-full border-b bg-background z-50">
      <div className="flex items-center justify-between px-4 h-16 max-w-[2000px] mx-auto">
        <motion.div 
          className="flex items-center gap-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Logo size="lg" />
          <h1 className="font-montserrat text-base sm:text-lg md:text-xl text-foreground/80">{title}</h1>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2 sm:gap-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <NotificationsBox />
        </motion.div>
      </div>
    </div>
  );
}
