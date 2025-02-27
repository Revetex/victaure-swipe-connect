
import { Skeleton } from "@/components/ui/skeleton";

export function ContractsLoading() {
  // Créer un tableau de 3 éléments pour simuler le chargement
  const skeletons = Array(3).fill(null);

  return (
    <div className="space-y-4">
      {skeletons.map((_, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
