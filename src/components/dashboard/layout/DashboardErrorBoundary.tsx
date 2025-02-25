import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorBoundaryProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function DashboardErrorBoundary({ error, resetErrorBoundary }: ErrorBoundaryProps) {
  return (
    <Alert variant="destructive" className="m-4">
      <AlertTitle>Une erreur est survenue</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="bg-destructive/10 text-destructive px-4 py-2 rounded-md hover:bg-destructive/20 transition-colors"
        >
          Réessayer
        </button>
      </AlertDescription>
    </Alert>
  );
}