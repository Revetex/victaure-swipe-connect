
import { ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Mic, Send, Square, StopCircle } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { toast } from "sonner";

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
    <div className="relative flex items-end gap-2 bg-[#2C2C2C] rounded-lg p-2">
      <div className="relative flex-1">
        <Textarea
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Message..."
          className="min-h-[45px] max-h-[160px] resize-none pr-12 bg-transparent border-none rounded-lg placeholder:text-[#808080] text-[#E0E0E0] focus:ring-0"
          disabled={isDisabled || isLoading}
        />
        <div className="absolute right-2 bottom-2 text-sm text-[#808080]">
          Use shift + return for new line
        </div>
      </div>

      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={isRecording ? "destructive" : "ghost"}
                className={cn(
                  "shrink-0 h-11 w-11 rounded-lg transition-all",
                  isRecording 
                    ? "bg-red-500/20 border-red-500/50 hover:bg-red-500/30 hover:border-red-500" 
                    : "bg-[#3C3C3C] hover:bg-[#4C4C4C]"
                )}
                onClick={onStartRecording}
                disabled={isDisabled || isLoading}
              >
                {isRecording ? (
                  <Square className="h-5 w-5 text-red-500 animate-pulse" />
                ) : (
                  <Mic className="h-5 w-5 text-[#E0E0E0]" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRecording ? "Arrêter l'enregistrement" : "Enregistrer un message"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {isSpeaking && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="shrink-0 h-11 w-11 rounded-lg bg-[#3C3C3C] hover:bg-[#4C4C4C]"
                  onClick={onStopSpeaking}
                >
                  <StopCircle className="h-5 w-5 text-[#E0E0E0] animate-pulse" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Arrêter la lecture
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="shrink-0 h-11 w-11 rounded-lg bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white"
                onClick={() => {
                  if (!isDisabled) {
                    onSendMessage();
                  } else {
                    toast.error(disabledMessage);
                  }
                }}
                disabled={!userInput.trim() || isLoading || isDisabled}
              >
                <Send className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Envoyer le message
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
