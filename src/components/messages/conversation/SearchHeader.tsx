import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

interface SearchHeaderProps {
  searchValue: string;
  unreadCount?: number;
  onSearch: (value: string) => void;
  onNewConversation: () => void;
}

export function SearchHeader({
  searchValue,
  unreadCount,
  onSearch,
  onNewConversation,
}: SearchHeaderProps) {
  return (
    <div className="flex items-center gap-2 p-4 border-b">
      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <Button onClick={onNewConversation} size="icon" variant="ghost">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}