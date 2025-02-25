
import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface MarketplaceSearchProps {
  value: string;
  isSearching: boolean;
  onChange: (value: string) => void;
}

export function MarketplaceSearch({ value, isSearching, onChange }: MarketplaceSearchProps) {
  return (
    <div className="relative flex-1">
      <Search 
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
          isSearching ? 'animate-spin text-primary' : 'text-muted-foreground'
        }`} 
      />
      <Input 
        placeholder="Rechercher dans le marketplace..." 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        className="pl-10" 
      />
    </div>
  );
}
