
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
  isEditing,
}: AppHeaderProps) {
  const isMobile = useIsMobile();
  
  // Hide header if any parent element has z-index 99999 (chat overlay)
  const overlayElement = document.querySelector('[style*="z-index: 99999"]');
  if (overlayElement) return null;

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur z-50 border-b h-14">
      <div className="flex items-center justify-between h-full px-4 max-w-[2000px] mx-auto">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Logo size="lg" />
          <h1 className="font-montserrat text-base sm:text-lg md:text-xl text-foreground/80">{title}</h1>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <NotificationsBox />
          </div>
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={cn(
                    "text-primary hover:bg-primary/5",
                    "transition-all duration-300",
                    "active:scale-95 touch-none"
                  )}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[380px] p-0 pt-14">
                <FeedSidebar className="border-none" />
              </SheetContent>
            </Sheet>
          )}
        </motion.div>
      </div>
    </header>
  );
}
