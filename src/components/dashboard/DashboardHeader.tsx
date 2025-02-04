import { Logo } from "@/components/Logo";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardHeaderProps {
  title: string;
  showFriendsList: boolean;
  onToggleFriendsList: () => void;
  isEditing?: boolean;
}

export function DashboardHeader({ 
  title, 
  showFriendsList, 
  onToggleFriendsList,
  isEditing 
}: DashboardHeaderProps) {
  const isMobile = useIsMobile();

  if (isEditing) return null;

  return (
    <div className="flex items-center justify-between py-3 px-4">
      <div className="flex items-center gap-4">
        <Logo size="sm" />
        <div className="h-6 w-px bg-border mx-2" />
        <h2 className="text-lg font-semibold text-foreground">
          {title}
        </h2>
      </div>
      
      <div className="flex items-center gap-2">
        <NotificationsBox />
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFriendsList}
          className="relative"
        >
          {showFriendsList ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}