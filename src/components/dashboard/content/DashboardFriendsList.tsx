import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
interface DashboardFriendsListProps {
  show: boolean;
  onClose: () => void;
}
export function DashboardFriendsList({
  show,
  onClose
}: DashboardFriendsListProps) {
  if (!show) return null;
  return <Card className="w-full max-w-md p-4 relative">
      
      <div className="pt-8">
        <h2 className="text-2xl font-semibold mb-4">Mes amis</h2>
        <div className="space-y-4">
          {/* La liste des amis sera implémentée ici */}
          <p className="text-muted-foreground text-center py-8">
            Aucun ami pour le moment
          </p>
        </div>
      </div>
    </Card>;
}