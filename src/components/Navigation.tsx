import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { memo, useState } from "react";

const NavLinks = memo(function NavLinks({ isMobile, signOut }: { isMobile: boolean; signOut: () => void }) {
  return (
    <nav className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-6`}>
      <motion.a 
        href="#" 
        className="text-foreground hover:text-primary transition-colors relative group bg-card px-3 py-2 rounded-md shadow-sm border border-border"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10">Trouver un Job</span>
        <span className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded" />
      </motion.a>
      <motion.a 
        href="#" 
        className="text-foreground hover:text-primary transition-colors relative group bg-card px-3 py-2 rounded-md shadow-sm border border-border"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10">Pour les Employeurs</span>
        <span className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded" />
      </motion.a>
      <motion.a 
        href="#" 
        className="text-foreground hover:text-primary transition-colors relative group bg-card px-3 py-2 rounded-md shadow-sm border border-border"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative z-10">Formation</span>
        <span className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded" />
      </motion.a>
      <div className={`flex ${isMobile ? 'justify-between mt-4' : ''} items-center gap-4`}>
        <ThemeToggle />
        <Button 
          variant="secondary"
          size="icon"
          onClick={signOut}
          className="bg-card hover:bg-card/90 text-foreground shadow-sm border border-border"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
});

export function Navigation() {
  const isMobile = useIsMobile();
  const { signOut, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return null;
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      className="sticky top-0 bg-card/95 backdrop-blur-sm shadow-md border-b border-border z-50"
      style={{ 
        willChange: 'transform',
        touchAction: 'none'
      }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <motion.a 
          href="/" 
          className="flex items-center gap-3 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Logo size={isMobile ? "sm" : "md"} />
          <span className="font-bold text-xl md:text-2xl text-primary relative">
            Victaure
            <span className="absolute -inset-x-4 -inset-y-2 border border-primary/20 rounded-lg scale-0 group-hover:scale-100 transition-transform" />
          </span>
        </motion.a>
        
        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="secondary"
                size="icon" 
                className="bg-card hover:bg-card/90 text-foreground shadow-sm border border-border"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right"
              className="w-[80vw] sm:w-[380px] bg-card border-border shadow-lg"
            >
              <div className="flex flex-col gap-6 mt-8">
                <NavLinks isMobile={true} signOut={() => {
                  setIsOpen(false);
                  signOut();
                }} />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <NavLinks isMobile={false} signOut={signOut} />
        )}
      </div>
    </motion.header>
  );
}