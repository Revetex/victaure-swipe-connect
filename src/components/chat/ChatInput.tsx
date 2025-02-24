
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
    <div className="flex items-end gap-2 pt-4">
      <div className="relative flex-1">
        <Textarea
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Écrivez votre message..."
          className="min-h-[45px] max-h-[160px] resize-none pr-12 bg-[#1A1F2C]/60 border-[#64B5D9]/30 rounded-xl placeholder:text-[#F1F0FB]/50 text-[#F1F0FB] focus:border-[#64B5D9]/60 focus:bg-[#1A1F2C]/80 transition-all"
          disabled={isDisabled || isLoading}
        />
      </div>

      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 h-11 w-11 rounded-xl bg-[#1A1F2C]/60 border border-[#64B5D9]/30 hover:bg-[#1A1F2C]/80 hover:border-[#64B5D9]/60 transition-all"
                onClick={onStartRecording}
                disabled={isDisabled || isLoading}
              >
                {isRecording ? (
                  <Square className="h-5 w-5 text-red-500" />
                ) : (
                  <Mic className="h-5 w-5 text-[#64B5D9]" />
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
                  className="shrink-0 h-11 w-11 rounded-xl bg-[#1A1F2C]/60 border border-[#64B5D9]/30 hover:bg-[#1A1F2C]/80 hover:border-[#64B5D9]/60 transition-all"
                  onClick={onStopSpeaking}
                >
                  <StopCircle className="h-5 w-5 text-[#64B5D9]" />
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
                className="shrink-0 h-11 w-11 rounded-xl bg-[#64B5D9] hover:bg-[#64B5D9]/90 text-white"
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
