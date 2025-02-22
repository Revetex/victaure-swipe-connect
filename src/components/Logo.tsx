
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
        "select-none cursor-pointer flex flex-col items-center gap-4",
        isMobile ? "w-full" : "",
        className
      )}
      onClick={startAIChat}
    >
      <img 
        src="/lovable-uploads/1af16883-f185-44b3-af14-6740c1358a27.png" 
        alt="Victaure Logo" 
        className={cn(
          logoSizes[size],
          "object-contain"
        )}
      />
      <span className={cn(
        "font-tiempos font-black tracking-[0.2em]",
        "text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 to-zinc-700",
        "dark:from-white dark:to-zinc-300",
        "[text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]",
        "dark:[text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff]",
        textSizes[size]
      )}>
        VICTAURE
      </span>
    </motion.div>
  );
}
