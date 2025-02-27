
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Users, MessagesSquare, UserPlus, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dispatch, SetStateAction } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FriendListHeaderProps {
  showOnlineOnly: boolean;
  setShowOnlineOnly: Dispatch<SetStateAction<boolean>>;
  pendingCount: number;
  onTogglePending: () => void;
}

export function FriendListHeader({ 
  showOnlineOnly, 
  setShowOnlineOnly,
  pendingCount = 0,
  onTogglePending
}: FriendListHeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Mes connexions</h2>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Settings2 className="h-4 w-4" />
                <span className="sr-only">Paramètres</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <Checkbox 
                  id="online-only"
                  checked={showOnlineOnly}
                  onCheckedChange={() => setShowOnlineOnly(!showOnlineOnly)}
                />
                <Label 
                  htmlFor="online-only" 
                  className="cursor-pointer flex-1"
                >
                  Afficher seulement en ligne
                </Label>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="flex justify-between cursor-pointer" 
                onClick={onTogglePending}
              >
                <span>Demandes en attente</span>
                {pendingCount > 0 && (
                  <Badge className="bg-primary text-white">
                    {pendingCount}
                  </Badge>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onTogglePending}
          >
            <div className="relative">
              <UserPlus className="h-4 w-4" />
              {pendingCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-white"
                >
                  {pendingCount}
                </Badge>
              )}
            </div>
          </Button>
        </div>
      </div>
      
      <div 
        className={cn(
          "relative overflow-hidden flex items-center gap-2",
          "border rounded-md transition-all duration-300",
          searchFocused
            ? "border-primary/50 shadow-sm shadow-primary/20"
            : "border-border/50"
        )}
      >
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un contact..."
          className="pl-10 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Connexions</span>
        </div>
      </div>
    </div>
  );
}
