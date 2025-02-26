
import { Star, Menu, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { VictaureChat } from "@/components/chat/VictaureChat";
import { Badge } from "@/components/ui/badge";

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

  // Gérer l'échap pour fermer proprement
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowChat(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleMenuClick = () => {
    if (setShowMobileMenu) {
      setShowMobileMenu(!showMobileMenu);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-[100] flex h-16 items-center justify-between px-4 bg-[#1C1C1C]/95 border-b border-[#3C3C3C]/20 shadow-[0_2px_10px_rgba(0,0,0,0.2)] backdrop-blur-sm"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMenuClick}
          className="text-[#E0E0E0] hover:bg-[#3C3C3C]/20 border border-[#3C3C3C]/10 active:scale-95 transition-transform touch-manipulation"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src="/lovable-uploads/color-logo.png"
              alt="Victaure Logo"
              className="h-9 w-9 object-contain shrink-0"
            />
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 bg-[#64B5D9] text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white/20"
            >
              BETA
            </Badge>
          </div>
          <span className="relative font-tiempos font-black tracking-[0.15em] text-[#E0E0E0] text-2xl shrink-0 pl-1">
            VICTAURE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {totalJobs !== undefined && (
          <div className="hidden sm:flex items-center px-3 py-1.5 bg-[#2C2C2C]/80 border border-[#3C3C3C]/20 rounded-full backdrop-blur-sm">
            <span className="text-xs text-[#E0E0E0]/80 whitespace-nowrap">
              {totalJobs} offres disponibles
            </span>
          </div>
        )}

        <Button
          onClick={() => setShowChat(true)}
          className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#64B5D9]/20 to-[#64B5D9]/10 hover:from-[#64B5D9]/30 hover:to-[#64B5D9]/20 border border-[#64B5D9]/20 rounded-full transition-all duration-300 shadow-lg shadow-black/20"
          title="Assistant IA"
        >
          <Bot className="h-4 w-4 text-[#64B5D9] group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-[#E0E0E0]/90 hidden sm:block">Assistant IA</span>
        </Button>

        <AnimatePresence>
          {showChat && (
            <Dialog 
              open={showChat} 
              onOpenChange={(open) => {
                if (!open) {
                  setShowChat(false);
                }
              }}
            >
              <DialogContent 
                className="fixed inset-0 p-0 bg-[#1C1C1C] border-0 rounded-none max-w-none w-full h-full overflow-hidden"
                style={{ transform: 'none' }}
              >
                <VictaureChat 
                  maxQuestions={user ? undefined : 3}
                  context="Tu es Mr. Victaure, un assistant professionnel spécialisé dans l'emploi. Tu aides les utilisateurs à trouver du travail et à améliorer leur carrière."
                  onMaxQuestionsReached={() => {
                    setShowChat(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
