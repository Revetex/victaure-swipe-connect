import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";

export function Navigation() {
  const isMobile = useIsMobile();
  const { signOut, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const NavLinks = () => (
    <nav className="flex gap-6 items-center">
      <a href="#" className="text-foreground hover:text-primary transition-colors relative group">
        <span className="relative z-10">Trouver un Job</span>
        <span className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded" />
      </a>
      <a href="#" className="text-foreground hover:text-primary transition-colors relative group">
        <span className="relative z-10">Pour les Employeurs</span>
        <span className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded" />
      </a>
      <a href="#" className="text-foreground hover:text-primary transition-colors relative group">
        <span className="relative z-10">Formation</span>
        <span className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded" />
      </a>
      <ThemeToggle />
      <Button 
        variant="ghost" 
        size="icon"
        onClick={signOut}
        className="text-primary hover:text-primary/80"
      >
        <User className="h-5 w-5" />
      </Button>
    </nav>
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <Logo size={isMobile ? "sm" : "md"} />
          <span className="font-bold text-xl sm:text-2xl text-primary relative">
            Victaure
            <span className="absolute -inset-x-4 -inset-y-2 border border-primary/20 rounded-lg scale-0 group-hover:scale-100 transition-transform" />
          </span>
        </a>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-background/95 border-border">
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