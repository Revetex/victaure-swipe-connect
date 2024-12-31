import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface SwipeEmptyStateProps {
  onRefresh: () => void;
}

export function SwipeEmptyState({ onRefresh }: SwipeEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="mb-6">
        <img 
          src="/placeholder.svg" 
          alt="No jobs found" 
          className="w-48 h-48 opacity-50"
        />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        Aucune mission disponible
      </h3>
      <p className="text-muted-foreground mb-6">
        Il n'y a plus de missions correspondant à vos critères pour le moment.
      </p>
      <Button 
        variant="outline" 
        onClick={onRefresh}
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Rafraîchir
      </Button>
    </div>
  );
}