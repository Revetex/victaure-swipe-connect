
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FriendSelector } from "./FriendSelector";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectFriend: (friendId: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange, onSelectFriend }: SearchBarProps) {
  return (
    <div className="sticky top-0 z-[200] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="p-4 flex items-center gap-2 max-w-3xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>
        <FriendSelector onSelectFriend={onSelectFriend}>
          <Button variant="outline" size="icon" className="shrink-0 hover:bg-background/80">
            <Plus className="h-4 w-4" />
          </Button>
        </FriendSelector>
      </div>
    </div>
  );
}
