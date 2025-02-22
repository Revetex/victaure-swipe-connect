
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface ConversationSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ConversationSearch({ searchTerm, onSearchChange }: ConversationSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8 bg-muted/50"
      />
    </div>
  );
}
