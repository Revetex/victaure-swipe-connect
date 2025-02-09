
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FeedSidebar } from "@/components/feed/FeedSidebar";

export interface AppHeaderProps {
  title: string;
  showFriendsList: boolean;
  onToggleFriendsList: () => void;
  isEditing: boolean;
  onToolReturn?: () => void;
}

export function AppHeader({
  title,
  showFriendsList,
  onToggleFriendsList,
  isEditing,
}: AppHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur z-30 border-b h-12">
      <div className="flex items-center justify-between h-full px-2 max-w-[2000px] mx-auto relative z-20">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "text-primary hover:bg-primary/5",
                    "transition-all duration-300",
                    "active:scale-95 touch-none"
                  )}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-[250px] p-0 z-40"
              >
                <FeedSidebar />
              </SheetContent>
            </Sheet>
          )}
          <Logo size="sm" />
          <h1 className="font-montserrat text-sm sm:text-base text-foreground/80">{title}</h1>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-1"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <NotificationsBox />
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              onClick={onToggleFriendsList}
              className={cn(
                "flex items-center gap-2 text-sm",
                "transition-all duration-300",
                "hover:bg-primary/10 hover:text-primary",
                showFriendsList && "bg-primary/5 text-primary"
              )}
              size="sm"
            >
              {showFriendsList ? "Masquer" : "Amis"}
            </Button>
          )}
        </motion.div>
      </div>
    </header>
  );
}
