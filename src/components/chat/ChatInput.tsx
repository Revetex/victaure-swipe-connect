
import { ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Mic, Send, Square } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { toast } from "sonner";
import { motion } from "framer-motion";

export interface ChatInputProps {
  userInput: string;
  setUserInput: (value: string) => void;
  isRecording: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  disabledMessage: string;
  onStartRecording: () => Promise<void>;
  onStopSpeaking: () => void;
  onSendMessage: () => Promise<void>;
}

export function ChatInput({
  userInput,
  setUserInput,
  isRecording,
  isSpeaking,
  isLoading,
  isDisabled,
  disabledMessage,
  onStartRecording,
  onStopSpeaking,
  onSendMessage
}: ChatInputProps) {
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isDisabled) {
        onSendMessage();
      } else {
        toast.error(disabledMessage);
      }
    }
  };

  return (
    <div className="flex gap-3 items-end">
      <div className="relative flex-1">
        <Textarea 
          value={userInput} 
          onChange={handleInputChange} 
          onKeyDown={handleKeyPress}
          placeholder="Message..."
          disabled={isDisabled || isLoading}
          className="min-h-[52px] max-h-[120px] pr-12 resize-none bg-[#1A1F2C] border-[#64B5D9]/20 placeholder:text-[#F2EBE4]/30 text-[#F2EBE4] focus-visible:ring-[#64B5D9]/20 rounded-xl"
        />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={isRecording ? onStopSpeaking : onStartRecording}
                disabled={isDisabled || isLoading}
                className="absolute right-2 bottom-2 h-9 w-9 bg-[#1A1F2C]/80 hover:bg-[#1A1F2C] border border-[#64B5D9]/20 rounded-lg"
              >
                <motion.div 
                  animate={isRecording ? { scale: [1, 1.2, 1] } : {}} 
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {isRecording ? 
                    <Square className="h-4 w-4 text-red-500" /> : 
                    <Mic className="h-4 w-4 text-[#F2EBE4]" />
                  }
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Button 
        onClick={() => !isDisabled && onSendMessage()} 
        disabled={isDisabled || isLoading || !userInput.trim()}
        className="bg-gradient-to-r from-[#64B5D9] to-[#4A90E2] hover:opacity-90 text-white h-[52px] px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        <Send className="h-5 w-5" />
        <span className="hidden sm:inline">Envoyer</span>
      </Button>
    </div>
  );
}
