
import { UserPlus2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionsHeaderProps {
  showPendingRequests: boolean;
  onTogglePendingRequests: () => void;
}

export function ConnectionsHeader({ showPendingRequests, onTogglePendingRequests }: ConnectionsHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
      <div className="flex items-center gap-3">
        <UserPlus2 className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-white">Mes Connexions</h2>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onTogglePendingRequests}
        className="hidden sm:flex bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50"
      >
        <UserCheck className="h-4 w-4 mr-2" />
        Demandes en attente
      </Button>
    </div>
  );
}
