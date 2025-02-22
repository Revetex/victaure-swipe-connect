
import { Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";

interface AppHeaderProps {
  totalJobs?: number;
  onRequestAssistant?: () => void;
}

export function AppHeader({ totalJobs, onRequestAssistant }: AppHeaderProps) {
  const { user } = useAuth();

  const handleAssistantRequest = () => {
    onRequestAssistant?.();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-16 items-center justify-between px-4 bg-[#9b87f5]/10 backdrop-blur-md border-b border-[#9b87f5]/20"
      >
        <div className="flex items-center justify-between relative z-50 w-full lg:w-64">
          <Logo />
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {totalJobs !== undefined && (
            <p className="text-xs text-[#9b87f5]">
              {totalJobs} offres disponibles
            </p>
          )}

          {onRequestAssistant && (
            <Button
              onClick={handleAssistantRequest}
              className="group relative overflow-hidden glass-panel hover:bg-[#9b87f5]/20 text-[#F2EBE4] font-medium transition-all duration-300 border border-[#9b87f5]/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5]/0 via-[#F2EBE4]/20 to-[#9b87f5]/0 opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
              <Sparkles className="h-4 w-4 mr-2 text-[#9b87f5]" />
              <span>Assistant Victaure IA</span>
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
