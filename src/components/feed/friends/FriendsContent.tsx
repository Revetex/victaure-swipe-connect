import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { useState } from "react";
import { UserProfile } from "@/types/profile";
import { ProfilePreview } from "@/components/ProfilePreview";
import { FriendRequestsSection } from "./FriendRequestsSection";
import { ConnectionsSection } from "./ConnectionsSection";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FriendsContent() {
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [isRequestsOpen, setIsRequestsOpen] = useState(true);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <ProfileSearch 
          onSelect={setSelectedProfile}
          placeholder="Rechercher quelqu'un..."
        />
      </div>

      <div className="space-y-6">
        <Collapsible
          open={isRequestsOpen}
          onOpenChange={setIsRequestsOpen}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full flex justify-between">
                <span>Demandes en attente</span>
                {isRequestsOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            <FriendRequestsSection />
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