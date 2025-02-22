
import { Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface JobsHeaderProps {
  totalJobs: number;
  onRequestAssistant: () => void;
}

export function JobsHeader({ totalJobs, onRequestAssistant }: JobsHeaderProps) {
  const { user } = useAuth();

  const handleAssistantRequest = () => {
    onRequestAssistant();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 bg-[#1B2A4A]/50 p-6 rounded-lg border border-[#64B5D9]/20"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Briefcase className="h-8 w-8 text-[#64B5D9]" />
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
          <h1 className="text-2xl font-bold text-[#F2EBE4]">
            Offres d'emploi
          </h1>
          <p className="text-sm text-[#64B5D9]">
            {totalJobs} offres disponibles
          </p>
        </div>
      </div>

      <Button
        onClick={handleAssistantRequest}
        className="group relative overflow-hidden glass-panel hover:bg-[#64B5D9]/20 text-[#F2EBE4] font-medium transition-all duration-300 border border-[#64B5D9]/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#64B5D9]/0 via-[#F2EBE4]/20 to-[#64B5D9]/0 opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000" />
        <Sparkles className="h-4 w-4 mr-2 text-[#64B5D9]" />
        <span>Assistant Victaure IA</span>
      </Button>
    </motion.div>
  );
}
