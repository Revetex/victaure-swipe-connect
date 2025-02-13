
import { useMarketplaceItems } from "@/hooks/useMarketplaceItems";
import { Loader2 } from "lucide-react";

export function ItemsList() {
  const { items, isLoading } = useMarketplaceItems();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Contenu à implémenter */}
      <p className="text-muted-foreground">Liste des articles à venir...</p>
    </div>
  );
}
