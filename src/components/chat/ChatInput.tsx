
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
    <div className="flex gap-2 items-end">
      <div className="flex-1 relative">
        <Textarea
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Message..."
          className="min-h-[44px] max-h-[120px] pr-24 resize-none bg-[#1A1F2C]/80 border-[#64B5D9]/10 placeholder:text-[#F2EBE4]/30 text-[#F2EBE4] focus-visible:ring-[#64B5D9]/20"
          disabled={isDisabled || isLoading}
        />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={isRecording ? onStopSpeaking : onStartRecording}
                disabled={isDisabled || isLoading}
                className="absolute right-2 bottom-2 h-8 w-8 bg-[#1A1F2C]/50 hover:bg-[#1A1F2C] border border-[#64B5D9]/10"
              >
                <motion.div
                  animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {isRecording ? (
                    <Square className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4 text-[#F2EBE4]" />
                  )}
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
        className="bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white h-[44px] px-4"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
