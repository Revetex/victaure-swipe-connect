import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function VCardSkeleton() {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600/50 to-indigo-900/50 dark:from-indigo-900/50 dark:to-indigo-950/50">
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        </div>
      </Card>
    </div>
  );
}