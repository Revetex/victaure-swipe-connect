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
  const {
    user
  } = useAuth();

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
  return <motion.header initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} className="fixed top-0 left-0 right-0 z-[100] flex h-14 items-center justify-between px-4 bg-[#1A1F2C] border-b border-[#9b87f5]/20 shadow-sm" style={{
    paddingTop: 'env(safe-area-inset-top)'
  }}>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handleMenuClick} className="text-white border border-[#9b87f5]/10 active:scale-95 transition-transform bg-black">
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-4 bg-transparent">
          <div className="relative">
            <img src="/lovable-uploads/color-logo.png" alt="Victaure Logo" className="h-8 w-8 object-contain" />
            <Badge variant="secondary" className="absolute -top-2 -right-2 bg-[#9b87f5] text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white/20">
              BETA
            </Badge>
          </div>
          <span className="font-medium tracking-wider text-[#F1F0FB] text-2xl">
            VICTAURE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {totalJobs !== undefined && <div className="hidden sm:flex items-center px-3 py-1.5 bg-[#9b87f5]/10 border border-[#9b87f5]/20 rounded-full">
            <span className="text-xs text-white/80 whitespace-nowrap">
              {totalJobs} offres disponibles
            </span>
          </div>}

        <Button onClick={() => setShowChat(true)} title="Assistant IA" className="group relative flex items-center gap-2 border border-[#9b87f5]/20 hover:border-[#9b87f5]/40 transition-all duration-300 shadow-sm text-sm px-[10px] py-1 rounded-md bg-black">
          <motion.div initial={{
          scale: 1
        }} whileHover={{
          scale: 1.1
        }} className="relative">
            <Bot className="h-4 w-4 text-[#9b87f5]" />
            <motion.div className="absolute -inset-1 bg-[#9b87f5]/20 rounded-full blur-md" animate={{
            opacity: [0.5, 0.7, 0.5],
            scale: [1, 1.2, 1]
          }} transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }} />
          </motion.div>
          <span className="text-sm font-normal text-white/90 hidden sm:block">
            Assistant IA
          </span>
        </Button>

        <AnimatePresence>
          {showChat && <Dialog open={showChat} onOpenChange={open => {
          if (!open) setShowChat(false);
        }}>
              <DialogContent className="max-w-[800px] h-[80vh] p-0 border-none bg-transparent backdrop-blur-none">
                <motion.div initial={{
              opacity: 0,
              scale: 0.95
            }} animate={{
              opacity: 1,
              scale: 1
            }} exit={{
              opacity: 0,
              scale: 0.95
            }} transition={{
              duration: 0.2
            }} className="relative w-full h-full overflow-hidden rounded-xl bg-[#1A1F2C] border border-[#9b87f5]/20 shadow-2xl">
                  <VictaureChat maxQuestions={3} onMaxQuestionsReached={() => setShowChat(false)} context="Tu es un assistant concis et amical qui aide les utilisateurs à utiliser la plateforme. Donne des réponses courtes et naturelles, comme si tu parlais à un ami." />
                </motion.div>
              </DialogContent>
            </Dialog>}
        </AnimatePresence>
      </div>
    </motion.header>;
}