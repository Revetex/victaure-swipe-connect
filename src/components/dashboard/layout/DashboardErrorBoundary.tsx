
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

interface DashboardErrorBoundaryProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function DashboardErrorBoundary({ error, resetErrorBoundary }: DashboardErrorBoundaryProps) {
  useEffect(() => {
    // Log error to console and potentially to an error tracking service
    console.error('Dashboard Error:', error);
    
    // Notify user with toast
    toast.error("Une erreur est survenue dans le tableau de bord");
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Alert variant="destructive" className="max-w-lg">
        <AlertTitle className="mb-2">Une erreur est survenue dans le tableau de bord</AlertTitle>
        <AlertDescription className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error.message}
          </p>
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
