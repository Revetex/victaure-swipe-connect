import { Search, MessageSquarePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchHeaderProps {
  unreadCount: number;
  onSearch: (value: string) => void;
  onNewConversation: () => void;
}

export function SearchHeader({ unreadCount, onSearch, onNewConversation }: SearchHeaderProps) {
  return (
    <div className="border-b p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Messages</h1>
        {unreadCount > 0 && (
          <Badge variant="default" className="bg-primary">
            {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans les messages..."
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="default"
          size="icon"
          onClick={onNewConversation}
          className="shrink-0"
        >
          <MessageSquarePlus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}