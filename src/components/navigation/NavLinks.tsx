import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavLinksProps {
  isMobile?: boolean;
}

export function NavLinks({ isMobile }: NavLinksProps) {
  const { signOut } = useAuth();

  return (
    <nav className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-4`}>
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
      <div className={`flex ${isMobile ? 'justify-between' : ''} items-center gap-2`}>
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
}