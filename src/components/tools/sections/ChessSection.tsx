
import { ChessPage } from "../ChessPage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function ChessSection() {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "flex flex-col h-full",
      "max-h-[calc(100vh-8rem)]",
      "sm:max-h-[calc(100vh-12rem)]",
      isMobile && "pb-16" // Ajoute un padding en bas sur mobile pour éviter que le contenu soit caché par la navigation
    )}>
      <ScrollArea className="flex-1 px-4">
        <div className={cn(
          "container mx-auto py-4",
          "max-w-3xl" // Limite la largeur maximale pour une meilleure lisibilité
        )}>
          <ChessPage />
        </div>
      </ScrollArea>
    </div>
  );
}
