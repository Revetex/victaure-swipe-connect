
import { ChessPage } from "../ChessPage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function ChessSection() {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "fixed inset-0 w-full h-full bg-background pt-16",
      "sm:relative sm:h-[calc(100vh-8rem)]",
      "flex flex-col",
      isMobile && "z-50" // Ensure it's above other content on mobile
    )}>
      <ScrollArea className="flex-1 w-full">
        <div className="container mx-auto p-4">
          <ChessPage />
        </div>
      </ScrollArea>
    </div>
  );
}
