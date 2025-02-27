
import { LucideUserSearch } from "lucide-react";

export function EmptyRequestsState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-muted/20 p-3 rounded-full mb-3">
        <LucideUserSearch className="h-8 w-8 text-muted-foreground/70" />
      </div>
      <h3 className="font-medium text-muted-foreground mb-1">
        Aucune demande en attente
      </h3>
      <p className="text-sm text-muted-foreground/70 max-w-xs">
        Vous n'avez pas de demandes d'amis en attente pour le moment.
      </p>
    </div>
  );
}
