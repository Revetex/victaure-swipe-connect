import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";

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
        <NotificationsBox />
        <ThemeToggle />
      </div>
    </nav>
  );

  return (
    <motion.header 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border/40 z-50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3 group cursor-pointer"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Logo size={isMobile ? "sm" : "md"} />
        </motion.div>
        
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