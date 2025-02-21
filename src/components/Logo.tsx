
import { useNavigate } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const BASE_GRADIENTS = {
  blue: ["from-indigo-500", "to-blue-500"],
  red: ["from-red-500", "to-pink-500"],
  green: ["from-green-500", "to-emerald-500"],
  purple: ["from-purple-500", "to-indigo-500"],
};

interface LogoProps {
  variant?: keyof typeof BASE_GRADIENTS;
  forceTheme?: "dark" | "light";
  className?: string;
}

export function Logo({ variant = "purple", forceTheme, className }: LogoProps) {
  const navigate = useNavigate();
  const { setReceiver, setShowConversation } = useReceiver();

  const startAIChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour discuter avec Mr Victaure");
        return;
      }

      // Configuration de l'assistant comme receiver
      const aiAssistant = {
        id: "ai-assistant",
        full_name: "Mr Victaure AI",
        avatar_url: "/ai-assistant-avatar.png",
        email: "ai@victaure.com",
        role: "professional",
        bio: "Assistant IA spécialisé dans l'emploi",
        online_status: "online",
        last_seen: new Date().toISOString(),
        is_assistant: true
      };

      setReceiver(aiAssistant);
      setShowConversation(true);
      navigate("/messages");
    } catch (error) {
      console.error("Error starting AI chat:", error);
      toast.error("Impossible de démarrer la conversation avec Mr Victaure");
    }
  };

  const [start, end] = BASE_GRADIENTS[variant];
  const textColorClass = forceTheme === "light" || (!forceTheme && variant === "purple")
    ? "text-white"
    : "text-zinc-900";

  return (
    <div 
      className="flex items-center justify-center relative cursor-pointer" 
      onClick={startAIChat}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${start} ${end} blur-2xl opacity-20`}
        aria-hidden="true"
      />
      <span className={`relative font-display font-bold text-xl ${textColorClass}`}>
        Mr Victaure
      </span>
    </div>
  );
}
