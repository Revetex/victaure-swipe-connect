import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

interface SearchHeaderProps {
  unreadCount: number;
  onSearch: (value: string) => void;
  onNewConversation: () => void;
}

export function SearchHeader({ unreadCount, onSearch, onNewConversation }: SearchHeaderProps) {
  return (
    <div className="border-b p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Messages</h1>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <Button onClick={onNewConversation} size="icon" variant="ghost">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          className="pl-8"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}