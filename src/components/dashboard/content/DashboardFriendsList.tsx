import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface DashboardFriendsListProps {
  show: boolean;
  onClose: () => void;
}

export function DashboardFriendsList({ show, onClose }: DashboardFriendsListProps) {
  if (!show) return null;

  return (
    <Card className="w-full max-w-md p-4 relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-2"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="pt-8">
        <h2 className="text-2xl font-semibold mb-4">Mes amis</h2>
        <div className="space-y-4">
          <p className="text-muted-foreground text-center py-8">
            Aucun ami pour le moment
          </p>
        </div>
      </div>
    </Card>
  );
}
