
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface JobsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function JobsSearch({ searchQuery, onSearchChange }: JobsSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Rechercher un emploi, une entreprise..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 h-12"
      />
    </div>
  );
}
