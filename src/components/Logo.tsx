
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const textSizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl"
};

const logoSizes = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
  xl: "w-12 h-12"
};

export function Logo({ size = "md", className }: LogoProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { setReceiver, setShowConversation } = useReceiver();

  const startAIChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour discuter avec Mr Victaure");
        return;
      }

      // Configuration de l'assistant comme receiver avec tous les champs requis
      const aiAssistant = {
        id: "ai-assistant",
        full_name: "Mr Victaure AI",
        avatar_url: "/ai-assistant-avatar.png",
        email: "ai@victaure.com",
        role: "professional" as const,
        bio: "Assistant IA spécialisé dans l'emploi",
        phone: null,
        city: null,
        state: null,
        country: "France",
        skills: [],
        latitude: null,
        longitude: null,
        online_status: "online" as const,
        last_seen: new Date().toISOString(),
        certifications: [],
        education: [],
        experiences: [],
        friends: []
      };

      setReceiver(aiAssistant);
      setShowConversation(true);
      navigate("/messages");
    } catch (error) {
      console.error("Error starting AI chat:", error);
      toast.error("Impossible de démarrer la conversation avec Mr Victaure");
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1
      }}
      className={cn(
        "select-none cursor-pointer",
        isMobile ? "w-full flex justify-center" : "",
        className
      )}
      onClick={startAIChat}
    >
      <motion.div 
        className={cn(
          "font-sans font-bold tracking-wider",
          "relative flex items-center justify-center",
          "transition-all duration-500",
          textSizes[size]
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center justify-center relative">
          <span className="font-inter text-zinc-900 dark:text-white font-black tracking-tight">
            VICTAURE
          </span>
          <div className="relative ml-3">
            <img 
              src="/lovable-uploads/1af16883-f185-44b3-af14-6740c1358a27.png" 
              alt="Victaure Logo" 
              className={cn(
                logoSizes[size],
                "object-contain drop-shadow"
              )}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
