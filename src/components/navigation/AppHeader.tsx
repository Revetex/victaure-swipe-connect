import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { NotificationsBox } from "../notifications/NotificationsBox";
import { Logo } from "../Logo";

interface AppHeaderProps {
  title: string;
  showFriendsList?: boolean;
  onToggleFriendsList?: () => void;
  isEditing?: boolean;
}

export function AppHeader({ 
  title,
  showFriendsList = false,
  onToggleFriendsList,
  isEditing = false
}: AppHeaderProps) {
  return (
    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
      <div className="flex items-center gap-4">
        <Logo size="sm" className="md:hidden" />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <NotificationsBox />
        {!isEditing && (
          <Button
            variant="outline"
            onClick={onToggleFriendsList}
            className={cn(
              "flex items-center gap-2 text-sm sm:text-base",
              "transition-all duration-300",
              "hover:bg-primary/10 hover:text-primary",
              showFriendsList ? 'bg-primary/5 text-primary' : ''
            )}
            size="sm"
          >
            <Menu className="h-4 w-4" />
            <span className="hidden sm:inline">Menu</span>
          </Button>
        )}
      </motion.div>
    </div>
  );
}