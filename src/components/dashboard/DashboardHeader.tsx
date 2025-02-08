
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FeedSidebar } from "../feed/FeedSidebar";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

export interface DashboardHeaderProps {
  title?: string;
  showFriendsList?: boolean;
  onToggleFriendsList?: () => void;
  isEditing?: boolean;
  onToolReturn?: () => void;
}

export function DashboardHeader({
  showFriendsList = false,
  onToggleFriendsList = () => {},
  isEditing = false
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between h-16 px-4 border-b">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px] sm:w-[350px]">
          <Suspense fallback={null}>
            <FeedSidebar />
          </Suspense>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-4">
        <NotificationsBox />
        {!isEditing && (
          <Button
            variant="outline"
            onClick={onToggleFriendsList}
            className={cn(
              "hidden md:flex items-center gap-2",
              "transition-all duration-300",
              "hover:bg-primary/10 hover:text-primary",
              showFriendsList && "bg-primary/5 text-primary"
            )}
          >
            <Menu className="h-4 w-4" />
            <span>Amis</span>
          </Button>
        )}
      </div>
    </div>
  );
}
