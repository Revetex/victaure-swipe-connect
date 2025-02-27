
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Paperclip, Send, SmileIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function MessageInput({ value, onChange, onSubmit }: MessageInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const emojis = ["😊", "😂", "❤️", "👍", "🙏", "😮", "👋", "🔥", "💯", "🎉"];

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit();
      }
    }
  };

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit();
    }
  };

  const insertEmoji = (emoji: string) => {
    onChange(value + emoji);
    textareaRef.current?.focus();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast.info("Enregistrement vocal terminé");
    } else {
      setIsRecording(true);
      toast.info("Enregistrement vocal démarré");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-background/80 backdrop-blur-sm border-t border-[#64B5D9]/10"
    >
      <div className={cn(
        "flex items-end gap-2",
        "p-2 rounded-lg",
        "bg-[#1A1F2C]/50 backdrop-blur-sm",
        "border border-[#64B5D9]/10",
        "transition-all duration-300",
        isFocused && "border-[#64B5D9]/30 bg-[#1A1F2C]/70 ring-1 ring-[#64B5D9]/10"
      )}>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full shrink-0 text-muted-foreground"
          onClick={() => toast.info("Ajout de fichiers à venir")}
        >
          <Paperclip className="h-4 w-4" />
          <span className="sr-only">Ajouter un fichier</span>
        </Button>
        
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Écrivez votre message..."
          className={cn(
            "flex-1 bg-transparent resize-none overflow-hidden",
            "text-[#F2EBE4] placeholder-[#F2EBE4]/30",
            "focus:outline-none",
            "min-h-[40px] max-h-[120px]",
            "py-2 px-3",
            "scrollbar-thin scrollbar-thumb-[#64B5D9]/10 scrollbar-track-transparent"
          )}
          style={{
            minHeight: '40px',
          }}
          rows={1}
        />
        
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={cn(
              "h-8 w-8 rounded-full shrink-0 text-muted-foreground",
              showEmojis && "text-primary"
            )}
            onClick={() => setShowEmojis(!showEmojis)}
          >
            <SmileIcon className="h-4 w-4" />
            <span className="sr-only">Emoji</span>
          </Button>
          
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={cn(
              "h-8 w-8 rounded-full shrink-0",
              isRecording ? "text-red-500 animate-pulse" : "text-muted-foreground"
            )}
            onClick={toggleRecording}
          >
            {isRecording ? <X className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            <span className="sr-only">
              {isRecording ? "Arrêter l'enregistrement" : "Enregistrement vocal"}
            </span>
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={!value.trim() && !isRecording}
            size="icon"
            className={cn(
              "h-8 w-8 rounded-full shrink-0",
              "bg-[#64B5D9] hover:bg-[#64B5D9]/80",
              "transition-all duration-300",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4 text-[#F2EBE4]" />
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 p-2 bg-background border rounded-lg flex flex-wrap gap-1 shadow-lg"
          >
            {emojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="hover:bg-accent p-1 rounded-md transition-colors"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 p-3 bg-background/80 border border-red-300 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <p className="text-sm text-red-500">Enregistrement en cours...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
