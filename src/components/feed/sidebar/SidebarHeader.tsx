
import { Dispatch, SetStateAction } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  searchText: string;
  setSearchText: Dispatch<SetStateAction<string>>;
}

export function SidebarHeader({ searchText, setSearchText }: SidebarHeaderProps) {
  return (
    <div className="sticky top-0 z-10 py-3 px-4 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={cn(
            "w-full pl-10 pr-4 py-2",
            "bg-muted/30 border-border/50",
            "placeholder:text-muted-foreground/70",
            "focus-visible:ring-primary/20"
          )}
        />
      </div>
    </div>
  );
}
