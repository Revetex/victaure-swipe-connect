
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ContractsLoading() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </Card>
      ))}
    </div>
  );
}
