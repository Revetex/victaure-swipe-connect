
import { ChessPage } from "../ChessPage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function ChessSection() {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "flex flex-col h-full",
      "max-h-[calc(100vh-4rem)]",
      "sm:max-h-[calc(100vh-8rem)]",
      isMobile && "pb-16" // Add bottom padding on mobile to avoid navigation overlap
    )}>
      <ScrollArea className="flex-1">
        <ChessPage />
      </ScrollArea>
    </div>
  );
}
