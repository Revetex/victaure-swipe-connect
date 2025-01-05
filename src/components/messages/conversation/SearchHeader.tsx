import { Search, Bell, ArrowUpDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchHeaderProps {
  unreadCount: number;
  onSearch: (value: string) => void;
  onToggleSort: () => void;
}

export function SearchHeader({ unreadCount, onSearch, onToggleSort }: SearchHeaderProps) {
  return (
    <div className="p-4 border-b space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSort}
            className="hover:bg-primary/10"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 relative"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Rechercher dans les messages..."
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1"
          prefix={<Search className="h-4 w-4 text-muted-foreground" />}
        />
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}