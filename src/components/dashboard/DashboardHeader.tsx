import { Button } from "@/components/ui/button";
import { Menu as MenuIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";

export interface DashboardHeaderProps {
  title: string;
  showFriendsList: boolean;
  onToggleFriendsList: () => void;
  isEditing: boolean;
}

export function DashboardHeader({
  title,
  showFriendsList,
  onToggleFriendsList,
  isEditing
}: DashboardHeaderProps) {
  return (
    <div className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4 max-w-[2000px] mx-auto">
        <div className="flex items-center gap-6">
          <Logo size="lg" />
          <h1 className="font-montserrat text-base sm:text-lg md:text-xl text-foreground/80">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <NotificationsBox />
          {!isEditing && (
            <Button
              variant="outline"
              onClick={onToggleFriendsList}
              className="flex items-center gap-2 text-sm sm:text-base"
              size="sm"
            >
              <MenuIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Amis</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}