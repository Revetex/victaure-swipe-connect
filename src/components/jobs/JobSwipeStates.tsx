import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Chargement des offres...</p>
    </div>
  );
}

export function NoJobsState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h3 className="text-xl font-semibold mb-4">
        Aucune offre disponible
      </h3>
      <p className="text-muted-foreground">
        Il n'y a pas d'offres correspondant à vos critères pour le moment.
      </p>
    </div>
  );
}

export function NoMoreJobsState({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h3 className="text-xl font-semibold mb-4">
        Vous avez vu toutes les offres !
      </h3>
      <p className="text-muted-foreground mb-6">
        Revenez plus tard pour découvrir de nouvelles missions.
      </p>
      <Button onClick={onRestart}>
        Recommencer
      </Button>
    </div>
  );
}