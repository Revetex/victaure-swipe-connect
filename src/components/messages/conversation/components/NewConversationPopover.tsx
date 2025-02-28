
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Search, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { UserAvatar } from "@/components/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Friend, convertOnlineStatusToBoolean } from "@/types/profile";

interface NewConversationPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactSelect: (contact: Friend) => void;
  friends: Friend[];
  isLoading: boolean;
}

export function NewConversationPopover({
  open,
  onOpenChange,
  onContactSelect,
  friends,
  isLoading
}: NewConversationPopoverProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Réinitialiser la recherche quand le popover se ferme
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  // Filtrer les contacts par terme de recherche
  const filteredFriends = searchQuery 
    ? friends.filter(friend => 
        friend.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friends;

  // Filtrer les contacts pour afficher d'abord les contacts en ligne
  const sortedFriends = [...filteredFriends].sort((a, b) => {
    if (a.online_status && !b.online_status) return -1;
    if (!a.online_status && b.online_status) return 1;
    return 0;
  });

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <span /> {/* Trigger invisible - contrôlé par le parent */}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-3 space-y-3">
          <div className="font-medium">Nouveau message</div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Chercher un contact..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="p-3 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedFriends.length > 0 ? (
            <div className="p-1">
              {sortedFriends.map(friend => (
                <Button
                  key={friend.id}
                  variant="ghost"
                  className="w-full justify-start px-2 py-3 h-auto"
                  onClick={() => {
                    onContactSelect(friend);
                  }}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="relative">
                      <UserAvatar 
                        user={{
                          id: friend.id,
                          name: friend.full_name || "",
                          image: friend.avatar_url
                        }}
                        className="h-9 w-9"
                      />
                      {friend.online_status && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {friend.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {friend.online_status ? (
                          <span className="text-green-500">En ligne</span>
                        ) : (
                          <span>Hors ligne</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-3 text-center text-muted-foreground">
              <UserPlus className="h-8 w-8 mb-2 opacity-50" />
              <p className="mb-2">Aucun contact trouvé</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  navigate("/friends/search");
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter des contacts
              </Button>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full"
            onClick={() => {
              onOpenChange(false);
              navigate("/friends/search");
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter de nouveaux contacts
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
