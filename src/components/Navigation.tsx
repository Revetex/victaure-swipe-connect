import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export function Navigation() {
  const isMobile = useIsMobile();

  const NavLinks = () => (
    <nav className="flex gap-6 items-center">
      <a href="#" className="text-victaure-gray-dark hover:text-victaure-blue transition-colors">
        Find Jobs
      </a>
      <a href="#" className="text-victaure-gray-dark hover:text-victaure-blue transition-colors">
        For Employers
      </a>
      <a href="#" className="text-victaure-gray-dark hover:text-victaure-blue transition-colors">
        Training
      </a>
      <Button className="bg-victaure-blue hover:bg-blue-600 text-white">
        Get Started
      </Button>
    </nav>
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="font-bold text-2xl text-victaure-blue">
          Victaure
        </a>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <NavLinks />
        )}
      </div>
    </header>
  );
}