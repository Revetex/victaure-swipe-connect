
import { Search, Plus } from "lucide-react";
import { FriendSelector } from "./FriendSelector";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectFriend: (friendId: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange, onSelectFriend }: SearchBarProps) {
  return (
    <div className="sticky top-16 left-0 right-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 border-b">
      <div className="flex items-center gap-2">
        <Command className="flex-1">
          <CommandInput 
            placeholder="Rechercher une conversation..." 
            value={searchQuery}
            onValueChange={onSearchChange}
          />
          <CommandList>
            {searchQuery && (
              <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
            )}
          </CommandList>
        </Command>
        <FriendSelector onSelectFriend={onSelectFriend}>
          <Button variant="outline" size="icon" className="shrink-0">
            <Plus className="h-4 w-4" />
          </Button>
        </FriendSelector>
      </div>
    </div>
  );
}
