
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Navigation } from "@/components/Navigation";
import { useState } from "react";

export function UserNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="relative hover:bg-accent transition-colors"
        >
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="p-0 w-full sm:w-[300px] border-r"
      >
        <Navigation onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
