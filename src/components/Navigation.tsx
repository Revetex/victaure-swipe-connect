import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

export function Navigation() {
  const isMobile = useIsMobile();
  const { signOut, isLoading } = useAuth();

  const NavLinks = () => (
    <nav className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-4`}>
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
      <div className={`flex ${isMobile ? 'justify-between mt-2' : ''} items-center gap-4`}>
        <ThemeToggle />
        <Button 
          variant="ghost" 
          size="icon"
          onClick={signOut}
          className="text-primary hover:text-primary/80 relative"
          disabled={isLoading}
        >
          {isLoading ? (
            <Skeleton className="h-5 w-5 rounded-full" />
          ) : (
            <User className="h-5 w-5" />
          )}
        </Button>
      </div>
    </nav>
  );

  if (isLoading) {
    return (
      <header className="sticky top-0 bg-background/90 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 bg-background/90 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 sm:gap-3 group">
          <Logo size={isMobile ? "sm" : "md"} />
          <span className="font-bold text-lg sm:text-xl md:text-2xl text-primary relative">
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
            <SheetContent className="w-[80vw] sm:w-[380px] bg-background/95 border-border">
              <div className="flex flex-col gap-6 mt-8">
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