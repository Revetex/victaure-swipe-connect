import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { FriendRequestsSection } from "./FriendRequestsSection";
import { ConnectionsSection } from "./ConnectionsSection";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="relative">
        <ProfileSearch 
          onSelect={setSelectedProfile}
          placeholder="Rechercher un contact..."
          className="w-full"
        />
        <UserPlus className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Gérez vos connections et demandes d'amis</span>
        </div>

        <Separator />

        <Collapsible
          open={isRequestsOpen}
          onOpenChange={setIsRequestsOpen}
          className="space-y-2"
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "w-full flex justify-between hover:bg-muted/50",
                "transition-colors duration-200",
                isRequestsOpen && "bg-muted/50"
              )}
            >
              <span className="font-medium">Demandes en attente</span>
              {isRequestsOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <div className="pl-2 animate-accordion-down">
              <FriendRequestsSection />
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <ConnectionsSection />
      </div>

      {selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}