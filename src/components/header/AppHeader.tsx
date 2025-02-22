
import { Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

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
        className="flex h-16 items-center justify-between px-4 bg-[#1B2A4A]/50 backdrop-blur-md border-b border-[#64B5D9]/20"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Briefcase className="h-6 w-6 text-[#64B5D9]" />
            <motion.div
              className="absolute -inset-2 bg-[#64B5D9]/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#F2EBE4]">
              Victaure
            </h1>
            {totalJobs !== undefined && (
              <p className="text-xs text-[#64B5D9]">
                {totalJobs} offres disponibles
              </p>
            )}
          </div>
        </div>

        {onRequestAssistant && (
          <Button
            onClick={handleAssistantRequest}
            className="group relative overflow-hidden glass-panel hover:bg-[#64B5D9]/20 text-[#F2EBE4] font-medium transition-all duration-300 border border-[#64B5D9]/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#64B5D9]/0 via-[#F2EBE4]/20 to-[#64B5D9]/0 opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
            <Sparkles className="h-4 w-4 mr-2 text-[#64B5D9]" />
            <span>Assistant Victaure IA</span>
          </Button>
        )}
      </motion.div>
    </div>
  );
}
