
import { TranslatorPage } from "../TranslatorPage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function TranslatorSection() {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "flex flex-col h-full",
      "max-h-[calc(100vh-8rem)]",
      "sm:max-h-[calc(100vh-12rem)]",
      isMobile && "pb-16" // Add bottom padding on mobile to prevent navigation overlap
    )}>
      <ScrollArea className="flex-1 px-4">
        <div className={cn(
          "container mx-auto py-4",
          "max-w-3xl" // Limit maximum width for better readability
        )}>
          <TranslatorPage />
        </div>
      </ScrollArea>
    </div>
  );
}
