import { ReloadIcon } from "@radix-ui/react-icons";

export function DashboardLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <ReloadIcon className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}