
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Search, 
  Bell, 
  Menu, 
  MessageCircle, 
  UserPlus, 
  Home, 
  Briefcase, 
  Newspaper, 
  Grid3X3, 
  Store
} from "lucide-react";
import { UserNav } from "@/components/UserNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppHeader() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Changer l'apparence du header lors du défilement
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tableau des liens de navigation pour la version mobile
  const navigationLinks = [
    { name: "Accueil", icon: Home, path: "/" },
    { name: "Emplois", icon: Briefcase, path: "/jobs" },
    { name: "Actualités", icon: Newspaper, path: "/news" },
    { name: "Marketplace", icon: Store, path: "/marketplace" },
    { name: "Applications", icon: Grid3X3, path: "/apps" },
  ];

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 w-full px-4 md:px-6 py-3",
        "transition-all duration-300",
        "border-b",
        scrolled 
          ? "bg-[#1B2A4A]/90 backdrop-blur-md border-[#64B5D9]/20" 
          : "bg-transparent border-transparent"
      )}
    >
      <div className="flex items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-[#F2EBE4] hover:text-[#F2EBE4]/80"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
          
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/white-signature.png" 
              alt="Victaure" 
              className="h-8 md:h-10"
            />
          </Link>
        </div>

        {isAuthenticated && (
          <>
            {/* Navigation - Version desktop uniquement */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationLinks.map((link) => (
                <Button 
                  key={link.path} 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className={cn(
                    "text-[#F2EBE4]/70 hover:text-[#F2EBE4] hover:bg-white/5",
                    location.pathname === link.path && "bg-white/10 text-[#F2EBE4]"
                  )}
                >
                  <Link to={link.path}>
                    <link.icon className="h-4 w-4 mr-2" />
                    {link.name}
                  </Link>
                </Button>
              ))}
            </nav>

            {/* Actions - Desktop */}
            <div className="hidden md:flex items-center gap-1 md:gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-[#F2EBE4]/70 hover:text-[#F2EBE4] hover:bg-white/5"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-[#F2EBE4]/70 hover:text-[#F2EBE4] hover:bg-white/5"
                asChild
              >
                <Link to="/messages">
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-[#F2EBE4]/70 hover:text-[#F2EBE4] hover:bg-white/5"
                asChild
              >
                <Link to="/connections">
                  <UserPlus className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-[#F2EBE4]/70 hover:text-[#F2EBE4] hover:bg-white/5 relative"
              >
                <Bell className="h-5 w-5" />
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500"
                >
                  3
                </Badge>
              </Button>
              
              <ThemeToggle />
              <UserNav />
            </div>

            {/* Actions pour mobile */}
            <div className="flex items-center gap-2 md:hidden">
              <UserNav />
            </div>
          </>
        )}

        {!isAuthenticated && (
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button 
              asChild 
              className="bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-[#1B2A4A]"
            >
              <Link to="/login">Connexion</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden mt-3 py-2 space-y-1 border-t border-white/10"
        >
          {navigationLinks.map((link) => (
            <Button
              key={link.path}
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "w-full justify-start text-[#F2EBE4]/70",
                location.pathname === link.path && "bg-white/10 text-[#F2EBE4]"
              )}
            >
              <Link to={link.path}>
                <link.icon className="h-4 w-4 mr-2" />
                {link.name}
              </Link>
            </Button>
          ))}
          
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#F2EBE4]/70 hover:text-[#F2EBE4]"
            >
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="text-[#F2EBE4]/70 hover:text-[#F2EBE4]"
              asChild
            >
              <Link to="/messages">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
              </Link>
            </Button>
            
            <ThemeToggle />
          </div>
        </motion.div>
      )}
    </header>
  );
}
