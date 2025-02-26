
import { Menu, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
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
        <Button variant="ghost" size="sm" onClick={handleMenuClick} className="text-white">
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <img src="/lovable-uploads/color-logo.png" alt="Logo" className="h-8 w-8" />
            <Badge className="absolute -top-2 -right-2 bg-[#64B5D9] text-[10px]">
              BETA
            </Badge>
          </div>
          <span className="text-white text-xl font-bold">VICTAURE</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {totalJobs !== undefined && (
          <div className="hidden sm:flex items-center px-3 py-1.5 bg-white/5">
            <span className="text-xs text-white">
              {totalJobs} offres
            </span>
          </div>
        )}

        <Button 
          onClick={() => setShowChat(true)} 
          variant="default"
          className="bg-[#64B5D9] text-white"
        >
          <Bot className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Assistant</span>
        </Button>

        {showChat && (
          <Dialog open={showChat} onOpenChange={setShowChat}>
            <DialogContent className="bg-[#1A1F2C] text-white">
              <DialogTitle>Assistant Victaure</DialogTitle>
              <DialogDescription>
                Service temporairement indisponible. Veuillez réessayer plus tard.
              </DialogDescription>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </header>
  );
}
