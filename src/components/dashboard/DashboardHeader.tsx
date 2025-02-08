
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Navigation } from "@/components/Navigation";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

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
  return (
    <div className="flex items-center justify-between w-full">
      <motion.div 
        className="flex items-center gap-6"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
            <Suspense fallback={null}>
              <Navigation onNavigate={onNavigate} />
            </Suspense>
          </SheetContent>
        </Sheet>
        <Logo size="lg" onClick={() => onNavigate("/")} className="cursor-pointer" />
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
          <Button
            variant="outline"
            onClick={onToggleFriendsList}
            className={cn(
              "flex items-center gap-2 text-sm sm:text-base",
              "transition-all duration-300",
              "hover:bg-primary/10 hover:text-primary",
              showFriendsList && "bg-primary/5 text-primary"
            )}
            size="sm"
          >
            <MenuIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Amis</span>
          </Button>
        )}
      </motion.div>
    </div>
  );
}
