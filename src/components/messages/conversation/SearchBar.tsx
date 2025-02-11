
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { FriendSelector } from "./FriendSelector";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectFriend: (friendId: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange, onSelectFriend }: SearchBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 border-b">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <FriendSelector onSelectFriend={onSelectFriend}>
          <Button variant="outline" size="icon" className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </FriendSelector>
      </div>
    </div>
  );
}
