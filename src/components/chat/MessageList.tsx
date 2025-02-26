import { RefObject, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speaker } from "@/utils/speaker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
interface Message {
  content: string;
  isUser: boolean;
  username?: string;
  timestamp?: number;
}
interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  ref?: RefObject<HTMLDivElement>;
}
export const MessageList = ({
  messages,
  isLoading,
  ref
}: MessageListProps) => {
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  const handleSpeak = (text: string, index: number) => {
    try {
      if (speakingMessageId === index) {
        speaker.stop();
        setSpeakingMessageId(null);
      } else {
        if (speakingMessageId !== null) {
          speaker.stop();
        }
        speaker.speak(text);
        setSpeakingMessageId(index);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
          setSpeakingMessageId(null);
        };
      }
    } catch (error) {
      console.error("Erreur de synthèse vocale:", error);
    }
  };
  return;
};