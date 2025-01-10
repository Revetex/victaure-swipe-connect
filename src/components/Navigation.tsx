import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export function Navigation() {
  const isMobile = useIsMobile();
  const { signOut, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const NavLinks = () => (
    <nav className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-6`}>
      <a href="#" className="text-foreground/80 hover:text-primary transition-colors relative group">
        <span className="relative z-10">Trouver un Job</span>
        <span className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded" />
      </a>
      <a href="#" className="text-foreground/80 hover:text-primary transition-colors relative group">
        <span className="relative z-10">Pour les Employeurs</span>
        <span className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded" />
      </a>
      <a href="#" className="text-foreground/80 hover:text-primary transition-colors relative group">
        <span className="relative z-10">Formation</span>
        <span className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded" />
      </a>
      <div className={`flex ${isMobile ? 'justify-between mt-4' : ''} items-center gap-4`}>
        <ThemeToggle />
        <Button 
          variant="ghost" 
          size="icon"
          onClick={signOut}
          className="text-primary hover:text-primary/80 hover:bg-primary/5"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border/40 z-50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <motion.a 
          href="/" 
          className="flex items-center gap-3 group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Logo size={isMobile ? "sm" : "md"} />
          <span className="font-bold text-xl md:text-2xl text-primary relative">
            Victaure
            <span className="absolute -inset-x-4 -inset-y-2 border border-primary/20 rounded-lg scale-0 group-hover:scale-100 transition-transform" />
          </span>
        </motion.a>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5">
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
    </motion.header>
  );
}