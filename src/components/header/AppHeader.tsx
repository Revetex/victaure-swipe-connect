import { Briefcase, Sparkles, Menu } from "lucide-react";
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
      className="fixed top-0 left-0 right-0 z-[100] flex h-16 items-center justify-between px-4 bg-[#0EA5E9] dark:bg-[#0EA5E9]/90 text-white border-2 border-black shadow-lg"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMenuClick}
          className="lg:hidden text-white hover:bg-white/20 border-2 border-black active:scale-95 transition-transform"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-3">
          <img
            src="/lovable-uploads/1af16883-f185-44b3-af14-6740c1358a27.png"
            alt="Victaure Logo"
            className="h-9 w-9 object-contain"
          />
          <span className="font-tiempos font-black tracking-[0.2em] text-[#F2EBE4] text-xl">
            VICTAURE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {totalJobs !== undefined && (
          <p className="text-xs text-white/80 border-2 border-black px-3 py-1.5 rounded-full">
            {totalJobs} offres disponibles
          </p>
        )}

        <Button
          onClick={() => setShowChat(true)}
          className="group bg-white/10 hover:bg-white/20 text-white text-sm py-1.5 px-3 h-8 rounded-lg border border-white/30 shadow-inner shadow-white/10 transition-all duration-200"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5 text-yellow-300" />
          <span className="hidden sm:inline">Assistant IA</span>
          <span className="sm:hidden">IA</span>
        </Button>

        <Dialog open={showChat} onOpenChange={setShowChat}>
          <DialogContent className="max-w-3xl w-[90vw] h-[80vh] p-0 bg-[#1B2A4A] border-2 border-black">
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
