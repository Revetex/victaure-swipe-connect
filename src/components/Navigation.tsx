
import { MessageSquare, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  onNavigate: (path: string) => void;
  className?: string;
}

export function Navigation({ onNavigate, className }: NavigationProps) {
  return (
    <div className={cn("h-full flex flex-col bg-background", className)}>
      <div className="h-16 border-b flex items-center px-4">
        <Logo 
          size="sm" 
          onClick={() => onNavigate("/")} 
          className="cursor-pointer" 
        />
      </div>

      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-4">
          <Button 
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onNavigate("/messages")}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>Messages</span>
          </Button>
          <Button 
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onNavigate("/settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            <span>Paramètres</span>
          </Button>
        </nav>
      </ScrollArea>

      <div className="h-16 border-t flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <NotificationsBox />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

