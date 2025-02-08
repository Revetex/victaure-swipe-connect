
import { ErrorBoundary } from "react-error-boundary";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

function ToolErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h3 className="text-lg font-semibold">Une erreur est survenue</h3>
      <p className="text-sm text-muted-foreground max-w-[300px]">
        {error.message || "Impossible de charger l'outil"}
      </p>
      <Button onClick={resetErrorBoundary} variant="outline">
        Réessayer
      </Button>
    </div>
  );
}

export function ToolErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ToolErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}
