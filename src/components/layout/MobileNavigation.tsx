
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

export function MobileNavigation() {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px]">
        <Navigation onNavigate={navigate} />
      </SheetContent>
    </Sheet>
  );
}
