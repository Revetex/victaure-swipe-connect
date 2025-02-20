
import { useState } from "react";
import { useReceiver } from "@/hooks/useReceiver";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/UserAvatar";
import type { UserProfile } from "@/types/profile";

interface ConversationListProps {
  className?: string;
}

export function ConversationList({ className }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { setReceiver, setShowConversation } = useReceiver();

  const mockUser: UserProfile = {
    id: '1',
    full_name: 'John Doe',
    avatar_url: null,
    email: 'john@example.com',
    role: 'professional',
    bio: null,
    phone: null,
    city: null,
    state: null,
    country: null,
    skills: [],
    latitude: null,
    longitude: null,
    online_status: false,
    last_seen: new Date().toISOString(),
    certifications: [],
    education: [],
    experiences: [],
    friends: []
  };

  const handleSelectConversation = (user: UserProfile) => {
    setReceiver({
      ...user,
      online_status: 'online',
      last_seen: new Date().toISOString()
    });
    setShowConversation(true);
  };

  return (
    <div className={cn("flex flex-col border-r", className)}>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          <button
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors"
            onClick={() => handleSelectConversation(mockUser)}
          >
            <UserAvatar
              user={mockUser}
              className="h-12 w-12"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="font-medium truncate">{mockUser.full_name}</p>
                <span className="text-xs text-muted-foreground">12:30</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                Dernier message...
              </p>
            </div>
          </button>
        </div>
      </ScrollArea>
    </div>
  );
}
