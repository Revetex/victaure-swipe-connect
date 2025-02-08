
import { ScrollArea } from "@/components/ui/scroll-area";
import { FriendRequestsSection } from "@/components/feed/friends/FriendRequestsSection";

export function FriendRequestsPage() {
  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="container mx-auto max-w-4xl p-4">
        <h1 className="text-2xl font-bold mb-6">Demandes d'amis</h1>
        <FriendRequestsSection />
      </div>
    </ScrollArea>
  );
}
