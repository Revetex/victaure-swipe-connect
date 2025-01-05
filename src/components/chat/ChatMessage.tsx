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
  const isUserMessage = !isBot;

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
      className={cn(
        "group relative flex gap-4 px-6 py-4 hover:bg-muted/30 transition-colors rounded-lg",
        isUserMessage ? "justify-end flex-row-reverse" : "justify-start"
      )}
    >
      <div className="shrink-0">
        {isBot ? (
          <div className={cn(
            "flex h-12 w-12 shrink-0 select-none items-center justify-center rounded-xl border shadow-sm",
            "bg-primary text-primary-foreground"
          )}>
            <Bot className="h-6 w-6" />
          </div>
        ) : (
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={profile?.avatar_url || ''} 
              alt={profile?.full_name || 'User'} 
              className="object-cover"
            />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className={cn(
        "flex flex-col space-y-1 max-w-[80%] md:max-w-[70%]",
        isUserMessage ? "items-end" : "items-start"
      )}>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base">
            {isBot ? "Mr. Victaure" : profile?.full_name || "Vous"}
          </span>
          {showTimestamp && timestamp && (
            <span className="text-sm text-muted-foreground">
              {new Date(timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className={cn(
          "rounded-lg px-4 py-2",
          isUserMessage 
            ? "bg-primary text-primary-foreground ml-auto" 
            : "bg-muted text-foreground mr-auto",
          "prose prose-neutral dark:prose-invert max-w-none"
        )}>
          {thinking ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-muted-foreground"
            >
              En train de réfléchir...
            </motion.div>
          ) : (
            <div className="flex items-start gap-2">
              <p className="mt-0 leading-relaxed">{content}</p>
              {isBot && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 hover:bg-primary/10 transition-colors"
                  onClick={handleVoicePlayback}
                >
                  {isPlaying ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
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