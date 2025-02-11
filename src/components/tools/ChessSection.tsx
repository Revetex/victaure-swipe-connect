
import { ChessPage } from "./ChessPage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function ChessSection() {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "fixed inset-0 w-full h-full bg-background",
      "sm:relative sm:h-[calc(100vh-4rem)]",
      "flex flex-col pt-16",
      isMobile && "z-50"
    )}>
      <ScrollArea className="flex-1 w-full">
        <div className="container mx-auto py-8 px-4">
          <ChessPage />
        </div>
      </ScrollArea>
    </div>
  );
}
