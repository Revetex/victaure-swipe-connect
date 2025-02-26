
import { Menu, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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

  const handleMenuClick = () => {
    if (setShowMobileMenu) {
      setShowMobileMenu(!showMobileMenu);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex h-16 items-center justify-between px-4 bg-[#1A1F2C] border-b border-white/5">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleMenuClick} className="text-white border border-white/10">
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <img src="/lovable-uploads/color-logo.png" alt="Victaure Logo" className="h-9 w-9 object-contain shrink-0" />
            <Badge variant="secondary" className="absolute -top-2 -right-2 bg-[#64B5D9] text-white text-[10px] px-1.5 py-0.5 rounded-full border border-white/20">
              BETA
            </Badge>
          </div>
          <span className="relative font-tiempos font-black tracking-[0.15em] text-[#F2EBE4] text-2xl shrink-0 pl-1">
            VICTAURE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {totalJobs !== undefined && 
          <div className="hidden sm:flex items-center px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
            <span className="text-xs text-white/80 whitespace-nowrap">
              {totalJobs} offres disponibles
            </span>
          </div>
        }

        <Button onClick={() => setShowChat(true)} className="flex items-center gap-2 px-4 py-2 bg-[#64B5D9] text-white rounded-full" title="Assistant IA">
          <Bot className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:block">M. Victaure</span>
        </Button>

        {showChat && (
          <Dialog open={showChat} onOpenChange={setShowChat}>
            <DialogContent className="bg-[#1A1F2C] border-white/10 text-white max-w-2xl">
              <DialogTitle>Chat avec M. Victaure</DialogTitle>
              <VictaureChat />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </header>
  );
}
