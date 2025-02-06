import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";

interface ErrorBoundaryProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function DashboardErrorBoundary({ error, resetErrorBoundary }: ErrorBoundaryProps) {
  const { toast } = useToast();

  console.error("Dashboard Error:", error);

  return (
    <Alert variant="destructive" className="m-4">
      <AlertTitle>Une erreur est survenue</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-4">
          <p>{error.message}</p>
          <div className="flex items-center gap-2">
            <ReloadIcon className="h-4 w-4 animate-spin" />
            <button
              onClick={resetErrorBoundary}
              className="bg-destructive/10 text-destructive px-4 py-2 rounded-md hover:bg-destructive/20 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}