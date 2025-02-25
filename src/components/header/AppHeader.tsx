
import { Star, Menu, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { VictaureChat } from "@/components/chat/VictaureChat";
import { Badge } from "@/components/ui/badge";
import { GoogleSearch } from "@/components/google-search/GoogleSearch";

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
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] flex flex-col h-auto items-center justify-between px-4 bg-[#1A1F2C] border-b border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="w-full flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMenuClick}
                className="text-white hover:bg-white/10 border border-white/10 active:scale-95 transition-transform touch-manipulation"
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
                className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#64B5D9]/20 to-[#64B5D9]/10 hover:from-[#64B5D9]/30 hover:to-[#64B5D9]/20 border border-[#64B5D9]/20 rounded-full transition-all duration-300 shadow-lg shadow-black/20"
                title="Assistant IA"
              >
                <Bot className="h-4 w-4 text-[#64B5D9] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white/90 hidden sm:block">Assistant IA</span>
              </Button>

              <Dialog open={showChat} onOpenChange={setShowChat}>
                <DialogContent className="max-w-3xl w-[95vw] h-[85vh] p-0 bg-[#1A1F2C] border border-[#64B5D9]/20 rounded-2xl mx-auto my-auto overflow-hidden">
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
          </div>

          <div className="w-full max-w-3xl mx-auto pb-4">
            <GoogleSearch />
          </div>
        </div>
      </motion.header>
      <div className="fixed top-[4.5rem] left-0 right-0 z-[99] px-4">
        <div className="w-full max-w-3xl mx-auto">
          <div id="search-results"></div>
        </div>
      </div>
    </>
  );
}
