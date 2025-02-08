
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { memo } from "react";

const MemoizedNavigation = memo(Navigation);

export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          aria-label="Open menu"
          className="relative"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="p-0 w-[280px]"
      >
        <MemoizedNavigation />
      </SheetContent>
    </Sheet>
  );
}
