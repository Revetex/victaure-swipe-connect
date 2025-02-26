
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
      className="fixed top-0 left-0 right-0 z-[100] flex h-16 items-center justify-between px-4 bg-[#1C1C1C]/90 border-b border-[#3C3C3C]/10 shadow-lg shadow-black/10"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMenuClick}
          className="text-[#E0E0E0] hover:bg-[#3C3C3C]/10 border border-[#3C3C3C]/5 active:scale-95 transition-transform touch-manipulation"
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
              className="absolute -top-2 -right-2 bg-[#64B5D9] text-[#E0E0E0] text-[10px] px-1.5 py-0.5 rounded-full border border-[#3C3C3C]/10"
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
          <div className="hidden sm:flex items-center px-3 py-1.5 bg-[#2C2C2C]/50 border border-[#3C3C3C]/10 rounded-full">
            <span className="text-xs text-[#E0E0E0]/70 whitespace-nowrap">
              {totalJobs} offres disponibles
            </span>
          </div>
        )}

        <Button
          onClick={() => setShowChat(true)}
          className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2C2C2C]/50 to-[#2C2C2C]/30 hover:from-[#3C3C3C]/50 hover:to-[#3C3C3C]/30 border border-[#3C3C3C]/10 rounded-full transition-all duration-300 shadow-sm"
          title="Assistant IA"
        >
          <Bot className="h-4 w-4 text-[#64B5D9] group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-[#E0E0E0]/80 hidden sm:block">Assistant IA</span>
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
