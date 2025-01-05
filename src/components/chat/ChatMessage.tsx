import { Bot, User, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ChatMessageProps {
  content: string;
  sender: string;
  thinking?: boolean;
  showTimestamp?: boolean;
  timestamp?: Date;
}

export function ChatMessage({
  content,
  sender,
  thinking = false,
  showTimestamp = false,
  timestamp,
}: ChatMessageProps) {
  const { profile } = useProfile();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const isBot = sender === "assistant";

  const handleVoicePlayback = async () => {
    try {
      if (isPlaying && audio) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setAudio(null);
        return;
      }

      const { data: { secret: apiKey }, error: secretError } = await supabase.functions.invoke('get-secret', {
        body: { secretName: 'ELEVEN_LABS_API_KEY' }
      });

      if (secretError || !apiKey) {
        throw new Error("Impossible de récupérer la clé API");
      }

      const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: content,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la synthèse vocale");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const newAudio = new Audio(audioUrl);

      newAudio.onended = () => {
        setIsPlaying(false);
        setAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      setAudio(newAudio);
      await newAudio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Erreur de synthèse vocale:", error);
      toast.error("Erreur lors de la lecture vocale. Veuillez réessayer.");
      setIsPlaying(false);
      setAudio(null);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group relative flex gap-4 px-6 py-4 hover:bg-muted/50 transition-colors rounded-lg"
    >
      <div className="shrink-0">
        {isBot ? (
          <div className={cn(
            "flex h-14 w-14 shrink-0 select-none items-center justify-center rounded-xl border shadow-sm",
            "bg-primary text-primary-foreground ring-2 ring-primary/10"
          )}>
            <Bot className="h-7 w-7" />
          </div>
        ) : (
          <Avatar className="h-14 w-14 ring-2 ring-primary/10">
            <AvatarImage 
              src={profile?.avatar_url || ''} 
              alt={profile?.full_name || 'User'} 
              className="object-cover"
            />
            <AvatarFallback>
              <User className="h-7 w-7" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="flex-1 space-y-2.5">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-lg bg-gradient-to-r from-primary to-high-contrast-magenta bg-clip-text text-transparent">
            {isBot ? "Mr. Victaure" : profile?.full_name || "Vous"}
          </span>
          {showTimestamp && timestamp && (
            <span className="text-sm text-muted-foreground">
              {new Date(timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {thinking ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-muted-foreground text-lg"
            >
              En train de réfléchir...
            </motion.div>
          ) : (
            <div className="flex items-start gap-3">
              <p className="mt-0 leading-relaxed text-lg">{content}</p>
              {isBot && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 hover:bg-primary/10 transition-colors"
                  onClick={handleVoicePlayback}
                >
                  {isPlaying ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}