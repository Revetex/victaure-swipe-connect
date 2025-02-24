
import { forwardRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { speaker } from "@/utils/speaker";
import { toast } from "sonner";

interface Message {
  content: string;
  isUser: boolean;
  username?: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, isLoading }, ref) => {
    const [typingIndex, setTypingIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);

    const typeMessage = async (text: string, speed = 30) => {
      setIsTyping(true);
      let currentIndex = 0;
      setCurrentText("");

      return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          if (currentIndex < text.length) {
            setCurrentText((prev) => prev + text[currentIndex]);
            currentIndex++;
          } else {
            clearInterval(interval);
            setIsTyping(false);
            resolve();
          }
        }, speed);
      });
    };

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
          
          // Arrêter automatiquement quand la lecture est terminée
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.onend = () => {
            setSpeakingMessageId(null);
          };
        }
      } catch (error) {
        console.error("Erreur de synthèse vocale:", error);
      }
    };

    useEffect(() => {
      if (messages.length > typingIndex && !messages[typingIndex].isUser) {
        typeMessage(messages[typingIndex].content).then(() => {
          setTypingIndex(typingIndex + 1);
        });
      } else if (messages.length > typingIndex && messages[typingIndex].isUser) {
        setTypingIndex(typingIndex + 1);
      }
    }, [messages, typingIndex]);

    useEffect(() => {
      // Configurer la voix
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => voice.lang === 'fr-FR');
      if (frenchVoice) {
        speaker.setVoice(frenchVoice);
      }
    }, []);

    return (
      <div 
        ref={ref}
        className="h-full overflow-y-auto py-4 px-3 scrollbar-none flex flex-col"
      >
        <div className="flex flex-col space-y-3 mt-auto">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div 
                key={index}
                className={`flex mb-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <motion.div 
                  className={`flex-1 relative group rounded-2xl px-4 py-3 ${
                    message.isUser 
                      ? 'bg-[#64B5D9] text-white rounded-br-sm ml-12' 
                      : 'bg-[#1B2A4A] text-[#F1F0FB] rounded-bl-sm mr-12'
                  }`}
                >
                  {!message.isUser ? (
                    <div className="space-y-4 pr-8">
                      {index === typingIndex - 1 && isTyping ? (
                        <p className="text-sm leading-relaxed">{currentText}</p>
                      ) : (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleSpeak(message.content, index)}
                      >
                        {speakingMessageId === index ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  )}
                </motion.div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex mb-3 items-start"
              >
                <div className="relative flex-1 bg-[#1B2A4A] rounded-2xl px-4 py-3">
                  <Loader2 className="w-4 h-4 text-[#64B5D9] animate-spin"/>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
