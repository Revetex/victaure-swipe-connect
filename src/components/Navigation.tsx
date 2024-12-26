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
      <a href="#" className="text-victaure-blue-light hover:text-victaure-blue transition-colors relative group">
        <span className="relative z-10">Trouver un Job</span>
        <span className="absolute inset-0 bg-victaure-blue/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded" />
      </a>
      <a href="#" className="text-victaure-blue-light hover:text-victaure-blue transition-colors relative group">
        <span className="relative z-10">Pour les Employeurs</span>
        <span className="absolute inset-0 bg-victaure-blue/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded" />
      </a>
      <a href="#" className="text-victaure-blue-light hover:text-victaure-blue transition-colors relative group">
        <span className="relative z-10">Formation</span>
        <span className="absolute inset-0 bg-victaure-blue/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded" />
      </a>
      <Button className="bg-victaure-blue hover:bg-victaure-blue-dark text-white relative overflow-hidden group">
        <span className="relative z-10">Commencer</span>
        <span className="absolute inset-0 bg-gradient-radial from-victaure-blue-light to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
    </nav>
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-victaure-dark/90 backdrop-blur-sm border-b border-victaure-blue/20 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="font-bold text-2xl text-victaure-blue-light relative group">
          <span className="animate-glow">Victaure</span>
          <span className="absolute -inset-x-4 -inset-y-2 border border-victaure-blue/20 rounded-lg scale-0 group-hover:scale-100 transition-transform" />
        </a>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-victaure-blue-light">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-victaure-dark/95 border-victaure-blue/20">
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