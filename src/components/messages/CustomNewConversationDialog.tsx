
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Friend } from "@/types/profile";
import { Search, User2 } from "lucide-react";
import { CustomConversationItem } from "./CustomConversationItem";
import { UserAvatar } from "@/components/UserAvatar";
import { useThemeContext } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

interface CustomNewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactSelect: (friend: Friend) => void;
  friends: Friend[];
  isLoading: boolean;
}

export function CustomNewConversationDialog({
  open,
  onOpenChange,
  onContactSelect,
  friends,
  isLoading,
}: CustomNewConversationDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { isDark } = useThemeContext();

  const filteredFriends = friends.filter((friend) => {
    const name = friend.full_name?.toLowerCase() || "";
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-md">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Nouvelle conversation</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un contact..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : filteredFriends.length === 0 ? (
              <div
                className={cn(
                  "flex flex-col items-center justify-center p-6 text-center",
                  "rounded-lg border-2 border-dashed",
                  isDark ? "border-gray-700" : "border-gray-200"
                )}
              >
                <User2 className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Aucun contact trouvé</p>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Essayez un autre terme de recherche
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => onContactSelect(friend)}
                  >
                    <div className="flex items-center p-3">
                      <div className="relative mr-3">
                        <UserAvatar
                          user={{
                            id: friend.id,
                            name: friend.full_name || "",
                            image: friend.avatar_url,
                          }}
                          className="h-10 w-10"
                        />
                        {friend.online_status && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{friend.full_name}</p>
                        {friend.bio && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {friend.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
