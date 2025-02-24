
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function MessageInput({ value, onChange, onSubmit }: MessageInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-[#1B2A4A]/90 border-t border-[#64B5D9]/10"
    >
      <div className={cn(
        "flex items-end gap-2 p-2 rounded-lg",
        "bg-[#1A1F2C]/50 backdrop-blur-sm",
        "border border-[#64B5D9]/10",
        "transition-all duration-300",
        isFocused && "border-[#64B5D9]/30 bg-[#1A1F2C]/70"
      )}>
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
        
        <Button
          onClick={handleSubmit}
          disabled={!value.trim()}
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
    </motion.div>
  );
}
