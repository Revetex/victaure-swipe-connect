
import { Users2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ConnectionsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ConnectionsSearch({ searchQuery, onSearchChange }: ConnectionsSearchProps) {
  return (
    <div className="relative mb-6">
      <Input
        placeholder="Rechercher une connexion..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-400"
      />
      <Users2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
    </div>
  );
}
