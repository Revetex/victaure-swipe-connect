
import { Star, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { VictaureChat } from "@/components/chat/VictaureChat";

interface AppHeaderProps {
  totalJobs?: number;
  onRequestAssistant?: () => void;
  showMobileMenu?: boolean;
  setShowMobileMenu?: (show: boolean) => void;
}

export function AppHeader({
  totalJobs,
  showMobileMenu,
  setShowMobileMenu
}: AppHeaderProps) {
  const [showChat, setShowChat] = useState(false);
  const { user } = useAuth();

  const handleMenuClick = () => {
    if (setShowMobileMenu) {
      setShowMobileMenu(!showMobileMenu);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-[100] flex h-16 items-center justify-between px-4 bg-[#1A1F2C] border-b border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.2)] backdrop-blur-none"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMenuClick}
          className="lg:hidden text-white hover:bg-white/10 border border-white/10 active:scale-95 transition-transform touch-manipulation"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-6">
          <img
            src="/lovable-uploads/color-logo.png"
            alt="Victaure Logo"
            className="h-9 w-9 object-contain shrink-0"
          />
          <span className="relative font-tiempos font-black tracking-[0.15em] text-[#F2EBE4] text-2xl shrink-0 pl-1">
            VICTAURE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {totalJobs !== undefined && (
          <div className="hidden sm:flex items-center px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <span className="text-xs text-white/80 whitespace-nowrap">
              {totalJobs} offres disponibles
            </span>
          </div>
        )}

        <Button
          onClick={() => setShowChat(true)}
          className="w-8 h-8 p-0 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 shadow-inner shadow-white/5 transition-all duration-200 touch-manipulation active:scale-95"
          title="Assistant IA"
        >
          <Star className="h-4 w-4 text-yellow-300" />
        </Button>

        <Dialog open={showChat} onOpenChange={setShowChat}>
          <DialogContent className="max-w-3xl w-[95vw] h-[85vh] p-0 bg-[#1A1F2C] border border-white/10 rounded-2xl mx-auto my-auto overflow-hidden">
            <VictaureChat 
              maxQuestions={user ? undefined : 3}
              context="Tu es Mr. Victaure, un assistant professionnel spécialisé dans l'emploi. Tu aides les utilisateurs à trouver du travail et à améliorer leur carrière."
              onMaxQuestionsReached={() => {
                setShowChat(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </motion.header>
  );
}
