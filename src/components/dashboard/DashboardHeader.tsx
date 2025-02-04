import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";

export interface DashboardHeaderProps {
  title: string;
  showFriendsList: boolean;
  onToggleFriendsList: () => void;
  isEditing: boolean;
  onToolReturn?: () => void;
}

export function DashboardHeader({
  title,
  showFriendsList,
  onToggleFriendsList,
  isEditing,
  onToolReturn
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        {onToolReturn && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToolReturn}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <Logo size="sm" />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationsBox />
        {!isEditing && (
          <Button
            variant="outline"
            onClick={onToggleFriendsList}
          >
            {showFriendsList ? 'Masquer les amis' : 'Afficher les amis'}
          </Button>
        )}
      </div>
    </div>
  );
}