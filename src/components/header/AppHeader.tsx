
import { Briefcase, Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";

interface AppHeaderProps {
  totalJobs?: number;
  onRequestAssistant?: () => void;
  showMobileMenu?: boolean;
  setShowMobileMenu?: (show: boolean) => void;
}

export function AppHeader({ 
  totalJobs, 
  onRequestAssistant,
  showMobileMenu,
  setShowMobileMenu 
}: AppHeaderProps) {
  const { user } = useAuth();

  const handleAssistantRequest = () => {
    onRequestAssistant?.();
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu?.(!showMobileMenu);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-16 items-center justify-between px-4 bg-background/50 backdrop-blur-md border-b border-border/10"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="lg:hidden bg-background/50 backdrop-blur-sm border border-border/10 hover:bg-background/80"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center justify-between relative z-50">
            <Logo />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {totalJobs !== undefined && (
            <p className="text-xs text-muted-foreground">
              {totalJobs} offres disponibles
            </p>
          )}

          <Button
            onClick={handleAssistantRequest}
            className="group relative overflow-hidden glass-panel bg-primary/10 hover:bg-primary/20 text-foreground font-medium transition-all duration-300 border border-border/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-foreground/10 to-primary/0 opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            <span className="hidden sm:inline">Assistant Victaure IA</span>
            <span className="sm:hidden">IA</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
