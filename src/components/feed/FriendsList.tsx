
import { Card } from "@/components/ui/card";
import { FriendsContent } from "./friends/FriendsContent";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function FriendsList() {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "container mx-auto max-w-4xl px-4",
      isMobile ? "pt-4" : "pt-20"
    )}>
      <Card className="p-6">
        <FriendsContent />
      </Card>
    </div>
  );
}
