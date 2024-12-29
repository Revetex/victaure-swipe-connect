import { Briefcase, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onRestart?: () => void;
  message: string;
  description: string;
  icon?: React.ReactNode;
  showRestartButton?: boolean;
}

export function EmptyState({ 
  onRestart, 
  message, 
  description, 
  icon = <Briefcase className="h-12 w-12 mb-4" />,
  showRestartButton = false 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
      {icon}
      <h3 className="text-lg font-semibold mb-2">{message}</h3>
      <p className="text-sm text-center">
        {description}
      </p>
      {showRestartButton && (
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onRestart}
        >
          Recommencer
        </Button>
      )}
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export function NoMoreJobsState({ onRestart }: { onRestart: () => void }) {
  return (
    <EmptyState
      message="C'est tout pour le moment!"
      description="Vous avez vu toutes les offres disponibles"
      icon={<Clock className="h-12 w-12 mb-4" />}
      onRestart={onRestart}
      showRestartButton
    />
  );
}

export function NoJobsState() {
  return (
    <EmptyState
      message="Aucune offre disponible"
      description="Revenez plus tard pour découvrir de nouvelles opportunités"
    />
  );
}