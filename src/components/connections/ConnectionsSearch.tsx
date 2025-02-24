
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/types/profile";

interface ConnectionsSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelectProfile: (profile: UserProfile) => void;
}

export function ConnectionsSearch({ 
  value, 
  onChange, 
  onSelectProfile 
}: ConnectionsSearchProps) {
  return (
    <div className="relative w-full mt-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Rechercher des connexions..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
