import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { NavLinks } from "./navigation/NavLinks";

export function Navigation() {
  const isMobile = useIsMobile();
  const { isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border/40 z-50"
    >
      <div className="container mx-auto h-14 flex items-center justify-between">
        <motion.a 
          href="/" 
          className="flex items-center gap-2 group"
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
              <div className="mt-6">
                <NavLinks isMobile />
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