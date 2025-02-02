import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchHeaderProps {
  onSearch: (value: string) => void;
  onNewConversation: () => void;
  searchValue?: string;
}

export function SearchHeader({ onSearch, onNewConversation }: SearchHeaderProps) {
  return (
    <div className="p-4 border-b flex items-center justify-between gap-4">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onSearch("")}
        className="text-muted-foreground hover:text-foreground"
      >
        <Search className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="default" 
        onClick={onNewConversation}
        size="sm"
        className="whitespace-nowrap"
      >
        Nouvelle conversation
      </Button>
    </div>
  );
}