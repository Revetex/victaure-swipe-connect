
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

const MemoizedNavigation = memo(Navigation);

export function MobileNavigation() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

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
        <MemoizedNavigation onNavigate={handleNavigate} />
      </SheetContent>
    </Sheet>
  );
}
