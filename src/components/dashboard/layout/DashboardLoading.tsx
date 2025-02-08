
import { ReloadIcon } from "@radix-ui/react-icons";

export function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <ReloadIcon className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );
}
