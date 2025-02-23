
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
      className="fixed top-0 left-0 right-0 z-[100] flex h-16 items-center justify-between px-4 bg-[#64B5D9] text-white border-2 border-black shadow-lg"
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
          className="group relative overflow-hidden bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 border-2 border-black"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
          <Sparkles className="h-4 w-4 mr-2 text-white" />
          <span className="hidden sm:inline">Assistant Victaure IA</span>
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
