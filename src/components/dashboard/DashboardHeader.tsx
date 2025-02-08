
import { Menu } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MobileNavigation } from "../layout/MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

export interface DashboardHeaderProps {
  title: string;
  showFriendsList: boolean;
  onToggleFriendsList: () => void;
  isEditing: boolean;
  onToolReturn?: () => void;
  onNavigate: (path: string) => void;
}

export function DashboardHeader({
  title,
  showFriendsList,
  onToggleFriendsList,
  isEditing,
  onNavigate
}: DashboardHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-between w-full">
      <motion.div 
        className="flex items-center gap-6"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isMobile && <MobileNavigation />}
        <Logo 
          size="lg" 
          onClick={() => onNavigate("/")} 
          className="cursor-pointer" 
        />
        <h1 className="font-montserrat text-base sm:text-lg md:text-xl text-foreground/80">
          {title}
        </h1>
      </motion.div>
      
      <motion.div 
        className="flex items-center gap-2 sm:gap-4"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <NotificationsBox />
        {!isEditing && (
          <button
            onClick={onToggleFriendsList}
            className={cn(
              "flex items-center gap-2 text-sm sm:text-base",
              "transition-all duration-300 px-3 py-2 rounded-lg",
              "hover:bg-primary/10 hover:text-primary",
              showFriendsList && "bg-primary/5 text-primary"
            )}
          >
            <Menu className="h-4 w-4" />
            <span className="hidden sm:inline">Amis</span>
          </button>
        )}
      </motion.div>
    </div>
  );
}
