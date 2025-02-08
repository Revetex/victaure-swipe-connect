
import { Menu } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { cn } from "@/lib/utils";
import { MobileNavigation } from "../layout/MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";

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
    <div className="flex items-center justify-between w-full h-full px-4">
      <div className="flex items-center gap-4">
        {isMobile && <MobileNavigation />}
        <Logo 
          size="sm" 
          onClick={() => onNavigate("/")} 
          className="cursor-pointer" 
        />
        {title && (
          <h1 className="text-lg font-medium text-foreground/80">
            {title}
          </h1>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationsBox />
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFriendsList}
            className={cn(
              "gap-2",
              showFriendsList && "bg-primary/5 text-primary"
            )}
          >
            <Menu className="h-4 w-4" />
            <span className="hidden sm:inline">Amis</span>
          </Button>
        )}
      </div>
    </div>
  );
}
