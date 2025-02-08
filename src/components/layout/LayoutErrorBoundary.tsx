
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface LayoutErrorBoundaryProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function LayoutErrorBoundary({ error, resetErrorBoundary }: LayoutErrorBoundaryProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Alert variant="destructive" className="max-w-lg">
        <AlertTitle className="mb-2">Une erreur est survenue dans la mise en page</AlertTitle>
        <AlertDescription className="space-y-4">
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Button 
            variant="outline" 
            onClick={resetErrorBoundary}
            className="w-full flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Recharger la page
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
